import { expect } from 'chai';
import { ethers } from 'hardhat';
import { StakingPool } from '../typechain-types';

describe('StakingPool', function () {
  let stakingPool: StakingPool;
  let stakingToken: any;
  let rewardToken: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock tokens
    const MockToken = await ethers.getContractFactory('MockToken');
    stakingToken = await MockToken.deploy('Staking Token', 'STK', 18);
    rewardToken = await MockToken.deploy('Reward Token', 'RWD', 18);

    // Deploy W3Token
    const W3Token = await ethers.getContractFactory('W3Token');
    const w3TokenObj = await W3Token.deploy();

    // Deploy StakingPool
    const StakingPool = await ethers.getContractFactory('StakingPool');
    const rewardRate = ethers.parseEther('0.00001'); // 0.00001 tokens per second
    stakingPool = await StakingPool.deploy(
      await stakingToken.getAddress(),
      await rewardToken.getAddress(),
      await w3TokenObj.getAddress(),
      owner.address,
      rewardRate
    );

    // Authorize pool on W3Token
    await w3TokenObj.setPoolStatus(await stakingPool.getAddress(), true);

    // Mint tokens to users
    await stakingToken.mint(user1.address, ethers.parseEther('1000'));
    await stakingToken.mint(user2.address, ethers.parseEther('1000'));
    await rewardToken.mint(await stakingPool.getAddress(), ethers.parseEther('100000'));
  });

  describe('Staking', function () {
    it('Should allow users to stake tokens', async function () {
      const stakeAmount = ethers.parseEther('100');

      // Approve staking
      await stakingToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);

      // Stake
      await expect(stakingPool.connect(user1).stake(stakeAmount))
        .to.emit(stakingPool, 'Staked')
        .withArgs(user1.address, stakeAmount);

      // Check balance
      expect(await stakingPool.stakerBalance(user1.address)).to.equal(stakeAmount);
    });

    it('Should not allow staking zero amount', async function () {
      await expect(
        stakingPool.connect(user1).stake(0)
      ).to.be.revertedWithCustomError(stakingPool, 'InvalidAmount');
    });

    it('Should track total staked', async function () {
      const stakeAmount = ethers.parseEther('100');

      await stakingToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      await stakingPool.connect(user1).stake(stakeAmount);

      expect(await stakingPool.totalStaked()).to.equal(stakeAmount);
    });
  });

  describe('Withdrawing', function () {
    beforeEach(async function () {
      const stakeAmount = ethers.parseEther('100');
      await stakingToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      await stakingPool.connect(user1).stake(stakeAmount);
    });

    it('Should allow users to withdraw tokens', async function () {
      const withdrawAmount = ethers.parseEther('50');

      await expect(stakingPool.connect(user1).withdraw(withdrawAmount))
        .to.emit(stakingPool, 'Withdrawn')
        .withArgs(user1.address, withdrawAmount);

      expect(await stakingPool.stakerBalance(user1.address)).to.equal(
        ethers.parseEther('50')
      );
    });

    it('Should not allow withdrawing more than staked', async function () {
      const withdrawAmount = ethers.parseEther('200');

      await expect(
        stakingPool.connect(user1).withdraw(withdrawAmount)
      ).to.be.revertedWithCustomError(stakingPool, 'InsufficientBalance');
    });
  });

  describe('Rewards', function () {
    beforeEach(async function () {
      const stakeAmount = ethers.parseEther('100');
      await stakingToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      await stakingPool.connect(user1).stake(stakeAmount);
    });

    it('Should calculate rewards correctly', async function () {
      // Wait some time for rewards to accrue
      await ethers.provider.send('hardhat_mine', ['0x3c']); // Mine 60 blocks

      const rewards = await stakingPool.getReward(user1.address);
      expect(rewards).to.be.gt(0);
    });

    it('Should allow users to claim rewards', async function () {
      // Wait for rewards
      await ethers.provider.send('hardhat_mine', ['0x3c']);

      const rewardsBefore = await stakingPool.getReward(user1.address);

      await expect(stakingPool.connect(user1).claimReward())
        .to.emit(stakingPool, 'RewardClaimed');

      // Rewards should be reset
      expect(await stakingPool.rewards(user1.address)).to.equal(0);
    });
  });
});
