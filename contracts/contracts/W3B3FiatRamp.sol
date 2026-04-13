// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Interfaces
import "./interfaces/ISwapRouter.sol";

/**
 * @title W3B3FiatRamp
 * @dev Handles incoming fiat-ramp fulfillments (e.g., from MoonPay/Stripe) 
 *      and automatically routes them into yield bearing staking positions.
 */
contract W3B3FiatRamp is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public fiatRampProvider; // Trusted address that fulfills the fiat order
    ISwapRouter public swapRouter;
    
    event FiatRampFulfilled(address indexed user, uint256 amountIn, address assetOut, uint256 amountOut);
    event ProviderUpdated(address indexed newProvider);
    event RouterUpdated(address indexed newRouter);

    modifier onlyTrustedProvider() {
        require(msg.sender == fiatRampProvider || msg.sender == owner(), "Unauthorized ramp provider");
        _;
    }

    constructor(address _fiatRampProvider, address _swapRouter, address initialOwner) Ownable(initialOwner) {
        require(_fiatRampProvider != address(0), "Invalid provider address");
        require(_swapRouter != address(0), "Invalid router address");

        fiatRampProvider = _fiatRampProvider;
        swapRouter = ISwapRouter(_swapRouter);
    }

    /**
     * @dev Called by the trusted off-chain ramp provider when a user's fiat payment clears.
     * The provider sends `msg.value` (or ERC20) which is then immediately swapped or staked for the user.
     * For native ETH deposits to be routed:
     */
    function fulfillFiatToYield(
        address user,
        address targetYieldAsset,
        uint256 minAmountOut
    ) external payable onlyTrustedProvider nonReentrant {
        require(msg.value > 0, "No funds provided");
        require(user != address(0), "Invalid user address");

        // Simple mock integration: in production this uses the swap router exactInputSingle
        // To swap ETH straight to the target asset (e.g. stETH)
        
        // Mock Implementation for Phase 6
        // Forward native ETH as a placeholder for the swap logic
        (bool success, ) = user.call{value: msg.value}("");
        require(success, "Transfer to user failed");

        emit FiatRampFulfilled(user, msg.value, targetYieldAsset, minAmountOut);
    }

    // --- Admin ---
    function setFiatRampProvider(address _newProvider) external onlyOwner {
        require(_newProvider != address(0), "Invalid provider address");
        fiatRampProvider = _newProvider;
        emit ProviderUpdated(_newProvider);
    }

    function setSwapRouter(address _newRouter) external onlyOwner {
        require(_newRouter != address(0), "Invalid router address");
        swapRouter = ISwapRouter(_newRouter);
        emit RouterUpdated(_newRouter);
    }

    // Accept native ETH
    receive() external payable {}
}
