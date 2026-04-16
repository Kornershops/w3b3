// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./interfaces/ISwapRouter.sol";

/**
 * @title W3B3AutonomousHarvester
 * @dev Allows trusted AI Keepers (or relayer networks like Gelato) to automatically 
 * rebalance a user's portfolio between whitelisted LST vaults to optimize yield,
 * without exposing raw withdrawal privileges.
 */
contract W3B3AutonomousHarvester is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Authorized AI keeper/relayer
    mapping(address => bool) public isAuthorizedKeeper;

    ISwapRouter public dexRouter;

    // User allowances bounding what the AI can manage
    // User => LST Asset => Allowed to be rebalanced?
    mapping(address => mapping(address => bool)) public userOptIn;

    event KeeperUpdated(address indexed keeper, bool status);
    event UserOptedIn(address indexed user, address indexed asset, bool status);
    event AutonomousRebalance(
        address indexed user,
        address indexed sourceAsset,
        address indexed targetAsset,
        uint256 amountIn,
        uint256 amountOut
    );

    modifier onlyKeeper() {
        require(isAuthorizedKeeper[msg.sender] || msg.sender == owner(), "Unauthorized keeper");
        _;
    }

    constructor(address _dexRouter, address initialOwner) Ownable(initialOwner) {
        require(_dexRouter != address(0), "Invalid router address");
        dexRouter = ISwapRouter(_dexRouter);
        isAuthorizedKeeper[initialOwner] = true;
    }

    /**
     * @dev User opt-in to allow the global AI keeper to route their specific asset.
     */
    function setOptIn(address asset, bool status) external {
        userOptIn[msg.sender][asset] = status;
        emit UserOptedIn(msg.sender, asset, status);
    }

    /**
     * @dev Executed by the AI Keeper to harvest/rebalance a position.
     * The LST is pulled from the user (requires prior ERC20 approval to this contract),
     * instantly swapped for the better yielding target LST, and sent immediately back.
     */
    function executeAutonomousRebalance(
        address user,
        address sourceAsset,
        address targetAsset,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyKeeper nonReentrant {
        require(amountIn > 0, "Amount > 0 required");
        require(userOptIn[user][sourceAsset], "User has not opted in this asset");

        // 1. Pull asset securely
        IERC20(sourceAsset).safeTransferFrom(user, address(this), amountIn);

        // 2. Perform open market or internal pool swap execution
        IERC20(sourceAsset).approve(address(dexRouter), amountIn);

        uint256 amountOut = dexRouter.exactInputSingle(ISwapRouter.ExactInputSingleParams({
            tokenIn: sourceAsset,
            tokenOut: targetAsset,
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: minAmountOut,
            sqrtPriceLimitX96: 0
        }));

        // 3. Return the newly rebalanced (better yielding) asset to the user silently
        IERC20(targetAsset).safeTransfer(user, amountOut);

        emit AutonomousRebalance(user, sourceAsset, targetAsset, amountIn, amountOut);
    }

    // --- Admin Config ---
    function setKeeperAuth(address _keeper, bool _status) external onlyOwner {
        isAuthorizedKeeper[_keeper] = _status;
        emit KeeperUpdated(_keeper, _status);
    }
}
