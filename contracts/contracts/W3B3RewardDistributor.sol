// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title W3B3RewardDistributor
 * @notice Distributes Real Yield in WETH to stakers of the native $W3B3 token.
 */
contract W3B3RewardDistributor is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken; // The $W3B3 ERC20 token
    IERC20 public rewardToken;  // The WETH ERC20 token

    uint256 public rewardPerTokenStored;
    uint256 public lastUpdateTime;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public stakerBalance;

    uint256 public totalStaked;

    error InvalidAddress();
    error InvalidAmount();
    error InsufficientBalance();

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        if (_stakingToken == address(0) || _rewardToken == address(0)) {
            revert InvalidAddress();
        }
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    /**
     * @notice Returns the amount of reward tokens per staked token.
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        
        // Simple logic for Real Yield: Current unallocated balance is rewarded over time
        // However, standard Real Yield usually pushes an 'amount' into a distribution period
        return rewardPerTokenStored;
    }

    /**
     * @notice Allows users to earn WETH by staking their $W3B3.
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        if (amount == 0) revert InvalidAmount();
        totalStaked += amount;
        stakerBalance[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraw staked $W3B3.
     */
    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert InvalidAmount();
        if (stakerBalance[msg.sender] < amount) revert InsufficientBalance();
        totalStaked -= amount;
        stakerBalance[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claims earned ETH (WETH) Real Yield rewards.
     */
    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function earned(address account) public view returns (uint256) {
        return ((stakerBalance[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) + rewards[account];
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /**
     * @notice Admin function to notify the contract of a new ETH deposit for distribution.
     * @dev To be called by RevenueRouter or Admin after sending WETH. 
     */
    function notifyRewardAmount(uint256 reward) external onlyOwner updateReward(address(0)) {
        if (reward == 0) revert InvalidAmount();
        
        if (totalStaked > 0) {
            rewardPerTokenStored = rewardPerTokenStored + (reward * 1e18 / totalStaked);
        }
        
        lastUpdateTime = block.timestamp;
        // In a more complex model, we spread this reward over a duration (e.g. 7 days).
    }
}
