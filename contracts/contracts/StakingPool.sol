// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import "./W3Token.sol";

/**
 * @title StakingPool
 * @notice Core staking contract for W3B3 platform secured with OpenZeppelin Pausable architecture
 * @dev Enables Multi-chain stakers to yield farm while minting liquid receipt derivations (w3TOKEN)
 */
contract StakingPool is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    IERC20 public rewardToken;
    W3Token public w3Token;

    address public treasury;     // Authorized address to collect protocol revenue
    uint256 public feePercentage; // Scale of 10000 (e.g. 500 = 5%)

    uint256 public rewardRate; // rewards per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public stakerBalance;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 public totalStaked;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward, uint256 feeCut);
    event RewardRateUpdated(uint256 newRate);
    event TreasuryUpdated(address newTreasury);
    event FeeUpdated(uint256 newFee);

    /**
     * @notice Initialize the securely upgraded staking pool
     */
    constructor(
        address _stakingToken,
        address _rewardToken,
        address _w3TokenAddress,
        address _treasuryAddress,
        uint256 _rewardRate
    ) Ownable(msg.sender) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardToken != address(0), "Invalid reward token");
        require(_w3TokenAddress != address(0), "Invalid wrapper");
        require(_treasuryAddress != address(0), "Invalid protocol collector");

        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        w3Token = W3Token(_w3TokenAddress);
        treasury = _treasuryAddress;
        rewardRate = _rewardRate;
        feePercentage = 500; // Defaults to establishing 5% protocol moat
        lastUpdateTime = block.timestamp;
    }

    // Admins Actions
    function adminPause() external onlyOwner {
        _pause();
    }

    function adminUnpause() external onlyOwner {
        _unpause();
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Empty Treasury Rejected");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Maximum fee allowed is 10% Protocol Cut");
        feePercentage = _feePercentage;
        emit FeeUpdated(_feePercentage);
    }

    /**
     * @notice Primary Stake 
     * @dev Automatically Mints W3Tokens to act as liquid derivatives
     */
    function stake(uint256 _amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(_amount > 0, "Amount must be greater than 0");

        totalStaked += _amount;
        stakerBalance[msg.sender] += _amount;
        
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Protocol Moat: Issue liquid derivatives
        w3Token.mint(msg.sender, _amount);

        emit Staked(msg.sender, _amount);
    }

    /**
     * @notice Withdraw original tokens
     * @dev Automatically burns previously wrapped derivatives unlocking TVL
     */
    function withdraw(uint256 _amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(_amount > 0, "Amount must be greater than 0");
        require(stakerBalance[msg.sender] >= _amount, "Insufficient balance");

        totalStaked -= _amount;
        stakerBalance[msg.sender] -= _amount;

        // Strip receipt wrapping 
        w3Token.burn(msg.sender, _amount);

        stakingToken.safeTransfer(msg.sender, _amount);

        emit Withdrawn(msg.sender, _amount);
    }

    /**
     * @notice Monetized Claim Generator
     * @dev Collects the configured percentage splitting earnings between protocol and stakers.
     */
    function claimReward() external nonReentrant whenNotPaused updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            
            // Calculate Treasury extraction Protocol Cut natively
            uint256 feeCut = (reward * feePercentage) / 10000;
            uint256 userTakeHome = reward - feeCut;

            rewardToken.safeTransfer(treasury, feeCut);
            rewardToken.safeTransfer(msg.sender, userTakeHome);
            
            emit RewardClaimed(msg.sender, userTakeHome, feeCut);
        }
    }

    function getReward(address _user) public view returns (uint256) {
        return
            rewards[_user] +
            ((stakerBalance[_user] * (rewardPerToken() - userRewardPerTokenPaid[_user])) / 1e18);
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) return rewardPerTokenStored;
        return
            rewardPerTokenStored +
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalStaked);
    }

    function setRewardRate(uint256 _newRate) external onlyOwner {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewardRate = _newRate;
        emit RewardRateUpdated(_newRate);
    }

    modifier updateReward(address _user) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[_user] = getReward(_user);
        userRewardPerTokenPaid[_user] = rewardPerTokenStored;
        _;
    }
}
