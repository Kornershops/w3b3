// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./W3B3Treasury.sol";

// Minimal interface for AMM Router (e.g. UniswapV3 Router / SwapRouter)
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

/**
 * @title RevenueRouter
 * @notice Executes automated market buy-backs of ETH using accumulated W3B3Treasury funds.
 * @dev Sweeps fees in various ERC20s, swaps them for ETH, and pushes them to the RewardDistributor.
 */
contract RevenueRouter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    W3B3Treasury public treasury;
    ISwapRouter public swapRouter;
    address public wethAddress;
    address public rewardDistributor;
    
    uint24 public poolFee = 3000; // Default 0.3% pool tier for Uniswap V3

    event HarvestExecuted(address indexed feeToken, uint256 amountIn, uint256 ethBought);

    constructor(
        address initialOwner, 
        address _treasury, 
        address _swapRouter, 
        address _wethAddress,
        address _rewardDistributor
    ) Ownable(initialOwner) {
        require(_treasury != address(0), "Invalid Treasury");
        require(_swapRouter != address(0), "Invalid SwapRouter");
        require(_wethAddress != address(0), "Invalid WETH");
        require(_rewardDistributor != address(0), "Invalid Distributor");

        treasury = W3B3Treasury(payable(_treasury));
        swapRouter = ISwapRouter(_swapRouter);
        wethAddress = _wethAddress;
        rewardDistributor = _rewardDistributor;
    }

    /**
     * @notice Admin function to update the RewardDistributor address.
     */
    function setRewardDistributor(address _rewardDistributor) external onlyOwner {
        require(_rewardDistributor != address(0), "Invalid address");
        rewardDistributor = _rewardDistributor;
    }

    /**
     * @notice Harvests accumulated fees from the Treasury and swaps them into ETH for Real Yield payout.
     * @param feeTokens Array of ERC20 token addresses to sweep and swap.
     * @param amountOutMinimums Slippage protection for each corresponding feeToken swap.
     */
    function harvest(address[] calldata feeTokens, uint256[] calldata amountOutMinimums) external onlyOwner nonReentrant {
        require(feeTokens.length == amountOutMinimums.length, "Mismatched parameters");

        uint256 totalEthBought = 0;

        for (uint256 i = 0; i < feeTokens.length; i++) {
            address token = feeTokens[i];
            
            uint256 balanceAvailable = IERC20(token).balanceOf(address(treasury));
            
            if (balanceAvailable > 0) {
                // Execute admin withdrawal from Treasury into this Router for swapping
                treasury.adminWithdrawERC20(token, address(this), balanceAvailable);

                // Approve SwapRouter
                IERC20(token).approve(address(swapRouter), balanceAvailable);

                // Execute Swap into WETH (Industry Standard for DEX swapping)
                ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
                    tokenIn: token,
                    tokenOut: wethAddress,
                    fee: poolFee,
                    recipient: rewardDistributor, // Directly push the Real Yield to the Distributor!
                    deadline: block.timestamp + 15,
                    amountIn: balanceAvailable,
                    amountOutMinimum: amountOutMinimums[i],
                    sqrtPriceLimitX96: 0
                });

                uint256 amountOut = swapRouter.exactInputSingle(params);
                totalEthBought += amountOut;

                emit HarvestExecuted(token, balanceAvailable, amountOut);
            }
        }

        // Notify the distributor of the new yield pool
        if (totalEthBought > 0) {
            IW3B3RewardDistributor(rewardDistributor).notifyRewardAmount(totalEthBought);
        }
    }
}

interface IW3B3RewardDistributor {
    function notifyRewardAmount(uint256 reward) external;
}
