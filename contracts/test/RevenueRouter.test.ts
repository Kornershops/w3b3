import { expect } from "chai";
import { ethers } from "hardhat";
import { RevenueRouter, W3B3Treasury, MockToken, MockSwapRouter, W3B3RewardDistributor } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("RevenueRouter Integration", function () {
  let router: RevenueRouter;
  let treasury: W3B3Treasury;
  let distributor: W3B3RewardDistributor;
  let mockSwapRouter: MockSwapRouter;
  let feeToken: MockToken;
  let weth: MockToken;
  let stakingToken: MockToken;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Deploy Mocks
    const MockTokenFactory = await ethers.getContractFactory("MockToken");
    feeToken = await MockTokenFactory.deploy("USDC", "USDC", 6);
    weth = await MockTokenFactory.deploy("Wrapped ETH", "WETH", 18);
    stakingToken = await MockTokenFactory.deploy("W3B3", "W3B3", 18);

    const MockSwapRouterFactory = await ethers.getContractFactory("MockSwapRouter");
    mockSwapRouter = await MockSwapRouterFactory.deploy(await weth.getAddress());

    // Deploy Treasury
    const TreasuryFactory = await ethers.getContractFactory("W3B3Treasury");
    treasury = await TreasuryFactory.deploy(owner.address);

    // Deploy Distributor
    const DistributorFactory = await ethers.getContractFactory("W3B3RewardDistributor");
    distributor = await DistributorFactory.deploy(await stakingToken.getAddress(), await weth.getAddress());

    // Deploy RevenueRouter
    const RouterFactory = await ethers.getContractFactory("RevenueRouter");
    router = await RouterFactory.deploy(
      owner.address,
      await treasury.getAddress(),
      await mockSwapRouter.getAddress(),
      await weth.getAddress(),
      await distributor.getAddress()
    );

    // Transfer ownership of Treasury and Distributor to Router for auto-withdraw/notify
    await treasury.transferOwnership(await router.getAddress());
    await distributor.transferOwnership(await router.getAddress());
  });

  describe("Harvesting & Swapping", function () {
    it("Should sweep fees from Treasury, swap to ETH, and notify Distributor", async function () {
        const feeAmount = ethers.parseUnits("1000", 6); // 1000 USDC
        await feeToken.mint(await treasury.getAddress(), feeAmount);

        // Pre-fill MockSwap with WETH for payout
        await weth.mint(await mockSwapRouter.getAddress(), ethers.parseEther("10"));

        // Stake some tokens to ensure rewardPerToken can calculate
        await stakingToken.mint(owner.address, ethers.parseEther("100"));
        await stakingToken.approve(await distributor.getAddress(), ethers.parseEther("100"));
        await distributor.stake(ethers.parseEther("100"));

        // Execute Harvest
        // The mock will swap the USDC for 1 ETH (hardcoded in mock)
        await router.harvest([await feeToken.getAddress()], [0]);

        // Verify Treasury is empty
        expect(await feeToken.balanceOf(await treasury.getAddress())).to.equal(0);

        // Verify Distributor received its WETH Real Yield
        expect(await weth.balanceOf(await distributor.getAddress())).to.be.above(0);
        
        // Verify rewards updated
        expect(await distributor.rewardPerToken()).to.be.above(0);
    });
  });
});
