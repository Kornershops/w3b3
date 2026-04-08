/**
 * W3B3 Protocol - Sepolia Testnet Configuration
 * 
 * Target: W3B3RewardDistributor
 * Purpose: Handling on-chain staking, reward calculation, and claims.
 */

export const CONTRACT_ADDRESSES = {
  // Replace these with your actual deployed Sepolia addresses
  REWARD_DISTRIBUTOR: process.env.NEXT_PUBLIC_REWARD_DISTRIBUTOR_ADDRESS || '0x0000000000000000000000000000000000000000',
  W3B3_TOKEN: process.env.NEXT_PUBLIC_W3B3_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
};

export const REWARD_DISTRIBUTOR_ABI = [
  "function stake(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function claimReward() external",
  "function getReward(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function rewardRate() external view returns (uint256)",
  "event Staked(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event RewardPaid(address indexed user, uint256 reward)"
] as const;

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
] as const;
