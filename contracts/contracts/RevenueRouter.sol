// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./W3B3Treasury.sol";
import "./W3Token.sol";

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
 * @notice Executes automated market buy-backs using accumulated W3B3Treasury funds.
 */
contract RevenueRouter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    W3B3Treasury public treasury;
    ISwapRouter public swapRouter;
    W3Token public w3Token;
    
    uint24 public poolFee = 3000; // Default 0.3% pool tier for Uniswap V3

    event HarvestExecuted(address indexed feeToken, uint256 amountIn, uint256 w3TokensBought);
    event BurnExecuted(uint256 amountBurned);

    constructor(
        address initialOwner, 
        address _treasury, 
        address _swapRouter, 
        address _w3Token
    ) Ownable(initialOwner) {
        require(_treasury != address(0), "Invalid Treasury");
        require(_swapRouter != address(0), "Invalid SwapRouter");
        require(_w3Token != address(0), "Invalid W3Token");

        treasury = W3B3Treasury(payable(_treasury));
        swapRouter = ISwapRouter(_swapRouter);
        w3Token = W3Token(_w3Token);
    }

    /**
     * @notice Harvests accumulated fees from the Treasury and buys W3TOKEN off the open market.
     * @param feeTokens Array of ERC20 token addresses to sweep and swap.
     * @param amountOutMinimums Slippage protection for each corresponding feeToken swap.
     */
    function harvest(address[] calldata feeTokens, uint256[] calldata amountOutMinimums) external onlyOwner nonReentrant {
        require(feeTokens.length == amountOutMinimums.length, "Mismatched parameters");

        uint256 totalBought = 0;

        for (uint256 i = 0; i < feeTokens.length; i++) {
            address token = feeTokens[i];
            
            // Note: Treasury must have granted allowance or the RevenueRouter must have admin withdraw rights over the Treasury.
            // For simplicity in this architecture, the owner extracts the ERC20 from Treasury into this router for swapping.
            uint256 balanceAvailable = IERC20(token).balanceOf(address(treasury));
            
            if (balanceAvailable > 0) {
                // Execute admin withdrawal from Treasury to this Router
                treasury.adminWithdrawERC20(token, address(this), balanceAvailable);

                // Approve SwapRouter
                IERC20(token).approve(address(swapRouter), balanceAvailable);

                // Execute Swap
                ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
                    tokenIn: token,
                    tokenOut: address(w3Token),
                    fee: poolFee,
                    recipient: address(this),
                    deadline: block.timestamp + 15,
                    amountIn: balanceAvailable,
                    amountOutMinimum: amountOutMinimums[i],
                    sqrtPriceLimitX96: 0
                });

                uint256 amountOut = swapRouter.exactInputSingle(params);
                totalBought += amountOut;

                emit HarvestExecuted(token, balanceAvailable, amountOut);
            }
        }
        
        // After all W3Tokens are bought, execute deflationary burn mechanism
        if (totalBought > 0) {
            w3Token.burn(address(this), totalBought);
            emit BurnExecuted(totalBought);
        }
    }
}
