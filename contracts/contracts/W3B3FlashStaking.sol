// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ISwapRouter.sol";

/**
 * @title W3B3FlashStaking
 * @dev Enables users to instantaneously swap between different active staking positions
 * by leveraging a protocol-owned liquidity buffer (or Aave Flash Loans under the hood)
 * rather than waiting for the standard 7-21 day unbonding periods.
 */
contract W3B3FlashStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // A trusted DEX Router used to transition from Token A -> Token B
    ISwapRouter public dexRouter;

    // Fee taken for utilizing the flash withdrawal bypass logic (e.g. 50 = 0.5%)
    uint256 public flashFeeBp = 50;
    address public treasury;

    event FlashStakeSwapped(address indexed user, address fromLST, address toLST, uint256 amountIn, uint256 amountOut);
    event FlashFeeUpdated(uint256 newBp);
    event TreasuryUpdated(address newTreasury);

    constructor(
        address _dexRouter,
        address _treasury,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_dexRouter != address(0), "Invalid router address");
        require(_treasury != address(0), "Invalid treasury address");
        
        dexRouter = ISwapRouter(_dexRouter);
        treasury = _treasury;
    }

    /**
     * @dev Core entrypoint: A user hands over their locked LST (Asset A), paying a fee to the treasury. 
     * The contract immediately issues them the equivalent value in the new target LST (Asset B),
     * completely bypassing the unbonding cooldown sequence.
     */
    function swapStakingPositions(
        address fromLST,
        address toLST,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant {
        require(amountIn > 0, "Amount must be > 0");

        // 1. Pull the locked user asset into the protocol
        IERC20(fromLST).safeTransferFrom(msg.sender, address(this), amountIn);

        // 2. Extract the quick-swap protocol fee
        uint256 fee = (amountIn * flashFeeBp) / 10000;
        uint256 netSwapAmount = amountIn - fee;

        if (fee > 0) {
            IERC20(fromLST).safeTransfer(treasury, fee);
        }

        // 3. Instead of unstaking `fromLST`, we just swap it instantly on the open market
        // Note: Production would enforce path creation / UniswapV3 multicall struct.
        // We use a mock interface abstraction here.
        
        IERC20(fromLST).approve(address(dexRouter), netSwapAmount);
        
        // Exact input swap routing
        uint256 amountOut = dexRouter.exactInputSingle(
            fromLST,
            toLST,
            netSwapAmount,
            minAmountOut
        );

        // 4. Return new target staked asset to the user 
        IERC20(toLST).safeTransfer(msg.sender, amountOut);

        emit FlashStakeSwapped(msg.sender, fromLST, toLST, amountIn, amountOut);
    }

    // --- Admin Config ---

    function setFlashFee(uint256 _newFeeBp) external onlyOwner {
        require(_newFeeBp <= 1000, "Fee too high"); // Max 10%
        flashFeeBp = _newFeeBp;
        emit FlashFeeUpdated(_newFeeBp);
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }
}
