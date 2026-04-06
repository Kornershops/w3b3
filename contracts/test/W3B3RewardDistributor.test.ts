import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3RewardDistributor, MockToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("W3B3RewardDistributor", function () {
  let distributor: W3B3RewardDistributor;
  let stakingToken: MockToken;
  let rewardToken: MockToken;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Mock Tokens
    const MockTokenFactory = await ethers.getContractFactory("MockToken");
    stakingToken = await MockTokenFactory.deploy("W3B3 Token", "W3B3", 18);
    rewardToken = await MockTokenFactory.deploy("Wrapped ETH", "WETH", 18);

    // Deploy Distributor
    const DistributorFactory = await ethers.getContractFactory("W3B3RewardDistributor");
    distributor = await DistributorFactory.deploy(await stakingToken.getAddress(), await rewardToken.getAddress());

    // Mint tokens to users
    await stakingToken.mint(user1.address, ethers.parseEther("1000"));
    await stakingToken.mint(user2.address, ethers.parseEther("1000"));
    
    // Initial approval
    await stakingToken.connect(user1).approve(await distributor.getAddress(), ethers.parseEther("1000"));
    await stakingToken.connect(user2).approve(await distributor.getAddress(), ethers.parseEther("1000"));
  });

  describe("Staking", function () {
    it("Should allow users to stake $W3B3", async function () {
      await distributor.connect(user1).stake(ethers.parseEther("100"));
      expect(await distributor.stakerBalance(user1.address)).to.equal(ethers.parseEther("100"));
      expect(await distributor.totalStaked()).to.equal(ethers.parseEther("100"));
    });
  });

  describe("Real Yield (Reward) Distribution", function () {
    it("Should distribute ETH (WETH) rewards pro-rata", async function () {
      // Stake multiple users
      await distributor.connect(user1).stake(ethers.parseEther("100"));
      await distributor.connect(user2).stake(ethers.parseEther("300")); // User 2 has 3x more weight

      // Simulate RevenueRouter sending rewards (WETH)
      const rewardAmount = ethers.parseEther("10"); // 10 ETH
      await rewardToken.mint(await distributor.getAddress(), rewardAmount);
      await distributor.notifyRewardAmount(rewardAmount);

      // Check earned
      const user1Earned = await distributor.earned(user1.address);
      const user2Earned = await distributor.earned(user2.address);

      // User 1 should have 2.5 ETH (25%), User 2 should have 7.5 ETH (75%)
      expect(user1Earned).to.equal(ethers.parseEther("2.5"));
      expect(user2Earned).to.equal(ethers.parseEther("7.5"));
    });

    it("Should allow users to claim rewards separately", async function () {
        await distributor.connect(user1).stake(ethers.parseEther("100"));
        
        const rewardAmount = ethers.parseEther("5");
        await rewardToken.mint(await distributor.getAddress(), rewardAmount);
        await distributor.notifyRewardAmount(rewardAmount);

        const initialBalance = await rewardToken.balanceOf(user1.address);
        await distributor.connect(user1).getReward();
        const finalBalance = await rewardToken.balanceOf(user1.address);

        expect(finalBalance - initialBalance).to.equal(rewardAmount);
    });
  });
});
