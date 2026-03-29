const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingPoolFactory", function () {
  let StakingPoolFactory;
  let factory;
  let owner;
  let addr1;
  let MockToken;
  let stakingToken;
  let rewardToken;
  let w3Token;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy mock tokens for constructor initialization
    MockToken = await ethers.getContractFactory("ERC20Mock");
    // Mock deployment - assuming ERC20Mock exists in OZ contracts for test or similar setup.
    // For the sake of asserting constructor logic, we can just pass randomized dummy addresses in a real environment
    // if the constructor only checks non-zero addresses statically without performing underlying calls.

    StakingPoolFactory = await ethers.getContractFactory("StakingPoolFactory");
    factory = await StakingPoolFactory.deploy();
    
    stakingToken = "0x1111111111111111111111111111111111111111";
    rewardToken  = "0x2222222222222222222222222222222222222222";
    w3Token      = "0x3333333333333333333333333333333333333333";
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await factory.owner()).to.equal(owner.address);
    });

    it("Should start with zero pools", async function () {
      expect(await factory.getPoolCount()).to.equal(0);
    });
  });

  describe("Pool Creation", function () {
    it("Should allow owner to create a new StakingPool tracking it correctly", async function () {
      const rewardRate = ethers.parseEther("0.1"); // 0.1 tokens per second
      const treasuryAddress = addr1.address;

      await expect(factory.createPool(
        stakingToken,
        rewardToken,
        w3Token,
        treasuryAddress,
        rewardRate
      )).to.emit(factory, "PoolCreated");

      // Verify the pool was pushed to the array
      expect(await factory.getPoolCount()).to.equal(1);

      const poolAddress = await factory.getPoolAddress(0);
      expect(poolAddress).to.not.equal(ethers.ZeroAddress);

      // Verify mapping
      expect(await factory.isDeployedByFactory(poolAddress)).to.be.true;
    });

    it("Should fail if non-owner tries to create a pool", async function () {
      const rewardRate = ethers.parseEther("0.1");
      
      await expect(
        factory.connect(addr1).createPool(
          stakingToken,
          rewardToken,
          w3Token,
          addr1.address,
          rewardRate
        )
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });
  });
});
