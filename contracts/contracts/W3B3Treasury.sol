// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title W3B3Treasury
 * @notice Central protocol treasury that accumulates fees from Staking Pools.
 * @dev Governed by an owner (ideally a Timelock or Multisig) offering Protocol-Owned Liquidity capabilities.
 */
contract W3B3Treasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    error InvalidTokenAddress();
    error InvalidDestinationAddress();
    error ZeroAmount();
    error InsufficientBalance();
    error NativeTransferFailed();

    event FundsWithdrawn(address indexed token, address indexed to, uint256 amount);
    event NativeFundsWithdrawn(address indexed to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Allows the contract to receive native gas tokens (e.g. ETH) directly.
     */
    receive() external payable {}

    /**
     * @notice Admin function to extract ERC20 funds for protocol operations.
     * @param token Address of the ERC20 token to extract.
     * @param to Address to send the tokens.
     * @param amount Amount to withdraw.
     */
    function adminWithdrawERC20(address token, address to, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0)) revert InvalidTokenAddress();
        if (to == address(0)) revert InvalidDestinationAddress();
        if (amount == 0) revert ZeroAmount();

        IERC20(token).safeTransfer(to, amount);
        
        emit FundsWithdrawn(token, to, amount);
    }

    /**
     * @notice Admin function to extract Native gas tokens (ETH/MATIC) for protocol operations.
     * @param to Address to send the tokens.
     * @param amount Amount to withdraw.
     */
    function adminWithdrawNative(address to, uint256 amount) external onlyOwner nonReentrant {
        if (to == address(0)) revert InvalidDestinationAddress();
        if (amount == 0) revert ZeroAmount();
        if (address(this).balance < amount) revert InsufficientBalance();

        (bool success, ) = to.call{value: amount}("");
        if (!success) revert NativeTransferFailed();

        emit NativeFundsWithdrawn(to, amount);
    }

    /**
     * @notice Simple view function to see native balance.
     */
    function getNativeBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Standardized method to view the treasury cache of a specific token.
     * @param token Address of the token.
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
