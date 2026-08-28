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
 * rebalance a user's portfolio between approved LST assets.
 */
contract W3B3AutonomousHarvester is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => bool) public isAuthorizedKeeper;
    mapping(address => bool) public isApprovedAsset;
    ISwapRouter public dexRouter;
    mapping(address => mapping(address => bool)) public userOptIn;

    event KeeperUpdated(address indexed keeper, bool status);
    event AssetApprovalUpdated(address indexed asset, bool status);
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
        require(_dexRouter.code.length > 0, "Invalid router contract");
        dexRouter = ISwapRouter(_dexRouter);
        isAuthorizedKeeper[initialOwner] = true;
    }

    function setOptIn(address asset, bool status) external {
        require(asset != address(0) && asset.code.length > 0, "Invalid asset");
        require(!status || isApprovedAsset[asset], "Asset not approved");
        userOptIn[msg.sender][asset] = status;
        emit UserOptedIn(msg.sender, asset, status);
    }

    function executeAutonomousRebalance(
        address user,
        address sourceAsset,
        address targetAsset,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyKeeper nonReentrant {
        require(user != address(0), "Invalid user");
        require(amountIn > 0, "Amount > 0 required");
        require(isApprovedAsset[sourceAsset], "Source asset not approved");
        require(isApprovedAsset[targetAsset], "Target asset not approved");
        require(userOptIn[user][sourceAsset], "User has not opted in this asset");

        IERC20(sourceAsset).safeTransferFrom(user, address(this), amountIn);
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

        IERC20(targetAsset).safeTransfer(user, amountOut);
        emit AutonomousRebalance(user, sourceAsset, targetAsset, amountIn, amountOut);
    }

    function setKeeperAuth(address _keeper, bool _status) external onlyOwner {
        require(_keeper != address(0), "Invalid keeper");
        isAuthorizedKeeper[_keeper] = _status;
        emit KeeperUpdated(_keeper, _status);
    }

    function setAssetApproval(address _asset, bool _status) external onlyOwner {
        require(_asset != address(0) && _asset.code.length > 0, "Invalid asset");
        isApprovedAsset[_asset] = _status;
        emit AssetApprovalUpdated(_asset, _status);
    }
}
