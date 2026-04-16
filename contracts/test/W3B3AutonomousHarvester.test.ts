import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3AutonomousHarvester, MockSwapRouter, MockERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("W3B3AutonomousHarvester", function () {
  let autonomousHarvester: W3B3AutonomousHarvester;
  let dexRouter: MockSwapRouter;
  let sourceAsset: MockERC20;
  let targetAsset: MockERC20;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let aiKeeper: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user, aiKeeper] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    sourceAsset = await ERC20Factory.deploy("Source LST", "sLST", 18) as unknown as MockERC20;
    targetAsset = await ERC20Factory.deploy("Target LST", "tLST", 18) as unknown as MockERC20;

    const RouterFactory = await ethers.getContractFactory("MockSwapRouter");
    dexRouter = await RouterFactory.deploy(await targetAsset.getAddress()) as unknown as MockSwapRouter;

    const HarvesterFactory = await ethers.getContractFactory("W3B3AutonomousHarvester");
    autonomousHarvester = await HarvesterFactory.deploy(
      await dexRouter.getAddress(),
      owner.address
    ) as unknown as W3B3AutonomousHarvester;

    // Provide user with source LST
    await sourceAsset.mint(user.address, ethers.parseEther("100"));
    
    // Provide Mock Router with destination LST so it can facilitate the swap
    await targetAsset.mint(await dexRouter.getAddress(), ethers.parseEther("1000"));

    // User approves the Harvester Contract so the AI can route funds on their behalf
    await sourceAsset.connect(user).approve(await autonomousHarvester.getAddress(), ethers.MaxUint256);

    // Owner sets up the authorized AI Keeper address
    await autonomousHarvester.connect(owner).setKeeperAuth(aiKeeper.address, true);
  });

  describe("Opt-in and Rebalancing Governance", function () {
    it("Should allow the user to opt-in a specific asset", async function () {
      await expect(
        autonomousHarvester.connect(user).setOptIn(await sourceAsset.getAddress(), true)
      ).to.emit(autonomousHarvester, "UserOptedIn")
       .withArgs(user.address, await sourceAsset.getAddress(), true);

      expect(await autonomousHarvester.userOptIn(user.address, await sourceAsset.getAddress())).to.equal(true);
    });

    it("Should revert if an unauthorized keeper attempts to rebalance", async function () {
      const unauthorizedKeeper = user;

      await expect(
        autonomousHarvester.connect(unauthorizedKeeper).executeAutonomousRebalance(
          user.address,
          await sourceAsset.getAddress(),
          await targetAsset.getAddress(),
          ethers.parseEther("5"),
          ethers.parseEther("4.5")
        )
      ).to.be.revertedWith("Unauthorized keeper");
    });

    it("Should successfully execute the automated rebalance for an opted-in user", async function () {
      // 1. User opts in
      await autonomousHarvester.connect(user).setOptIn(await sourceAsset.getAddress(), true);

      // 2. AI Keeper mathematically determines `targetAsset` has a higher APY and executes!
      const amountIn = ethers.parseEther("50");
      const expectedOut = ethers.parseEther("50"); // Mapped 1:1 by mock router

      await expect(
        autonomousHarvester.connect(aiKeeper).executeAutonomousRebalance(
          user.address,
          await sourceAsset.getAddress(),
          await targetAsset.getAddress(),
          amountIn,
          expectedOut
        )
      ).to.emit(autonomousHarvester, "AutonomousRebalance")
       .withArgs(user.address, await sourceAsset.getAddress(), await targetAsset.getAddress(), amountIn, expectedOut);

       // 3. User seamlessly receives the structurally superior token in their wallet without doing anything
       const userTargetBalance = await targetAsset.balanceOf(user.address);
       expect(userTargetBalance).to.equal(expectedOut);
    });
  });
});
