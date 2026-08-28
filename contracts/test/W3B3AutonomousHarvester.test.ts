import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3AutonomousHarvester, MockSwapRouter, MockERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("W3B3AutonomousHarvester", function () {
  let autonomousHarvester: W3B3AutonomousHarvester;
  let dexRouter: MockSwapRouter;
  let sourceAsset: MockERC20;
  let targetAsset: MockERC20;
  let unapprovedAsset: MockERC20;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let aiKeeper: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user, aiKeeper] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    sourceAsset = await ERC20Factory.deploy("Source LST", "sLST", 18) as unknown as MockERC20;
    targetAsset = await ERC20Factory.deploy("Target LST", "tLST", 18) as unknown as MockERC20;
    unapprovedAsset = await ERC20Factory.deploy("Unapproved LST", "uLST", 18) as unknown as MockERC20;

    const RouterFactory = await ethers.getContractFactory("MockSwapRouter");
    dexRouter = await RouterFactory.deploy(await targetAsset.getAddress()) as unknown as MockSwapRouter;

    const HarvesterFactory = await ethers.getContractFactory("W3B3AutonomousHarvester");
    autonomousHarvester = await HarvesterFactory.deploy(
      await dexRouter.getAddress(),
      owner.address
    ) as unknown as W3B3AutonomousHarvester;

    await sourceAsset.mint(user.address, ethers.parseEther("100"));
    await targetAsset.mint(await dexRouter.getAddress(), ethers.parseEther("1000"));
    await sourceAsset.connect(user).approve(await autonomousHarvester.getAddress(), ethers.MaxUint256);
    await autonomousHarvester.connect(owner).setKeeperAuth(aiKeeper.address, true);
    await autonomousHarvester.connect(owner).setAssetApproval(await sourceAsset.getAddress(), true);
    await autonomousHarvester.connect(owner).setAssetApproval(await targetAsset.getAddress(), true);
  });

  describe("Opt-in and Rebalancing Governance", function () {
    it("allows the user to opt-in an approved asset", async function () {
      await expect(
        autonomousHarvester.connect(user).setOptIn(await sourceAsset.getAddress(), true)
      ).to.emit(autonomousHarvester, "UserOptedIn")
       .withArgs(user.address, await sourceAsset.getAddress(), true);

      expect(await autonomousHarvester.userOptIn(user.address, await sourceAsset.getAddress())).to.equal(true);
    });

    it("rejects opt-in for an unapproved asset", async function () {
      await expect(
        autonomousHarvester.connect(user).setOptIn(await unapprovedAsset.getAddress(), true)
      ).to.be.revertedWith("Asset not approved");
    });

    it("allows an opted-in user to revoke an approved asset", async function () {
      await autonomousHarvester.connect(user).setOptIn(await sourceAsset.getAddress(), true);
      await expect(
        autonomousHarvester.connect(user).setOptIn(await sourceAsset.getAddress(), false)
      ).to.emit(autonomousHarvester, "UserOptedIn").withArgs(user.address, await sourceAsset.getAddress(), false);
    });

    it("rejects an unauthorized keeper", async function () {
      await expect(
        autonomousHarvester.connect(user).executeAutonomousRebalance(
          user.address,
          await sourceAsset.getAddress(),
          await targetAsset.getAddress(),
          ethers.parseEther("5"),
          ethers.parseEther("4.5")
        )
      ).to.be.revertedWith("Unauthorized keeper");
    });

    it("rejects an unapproved target asset even when the source is opted in", async function () {
      await autonomousHarvester.connect(user).setOptIn(await sourceAsset.getAddress(), true);
      await expect(
        autonomousHarvester.connect(aiKeeper).executeAutonomousRebalance(
          user.address,
          await sourceAsset.getAddress(),
          await unapprovedAsset.getAddress(),
          ethers.parseEther("5"),
          ethers.parseEther("4.5")
        )
      ).to.be.revertedWith("Target asset not approved");
    });

    it("rejects an unapproved source asset", async function () {
      await expect(
        autonomousHarvester.connect(aiKeeper).executeAutonomousRebalance(
          user.address,
          await unapprovedAsset.getAddress(),
          await targetAsset.getAddress(),
          ethers.parseEther("5"),
          ethers.parseEther("4.5")
        )
      ).to.be.revertedWith("Source asset not approved");
    });

    it("successfully executes an approved rebalance for an opted-in user", async function () {
      await autonomousHarvester.connect(user).setOptIn(await sourceAsset.getAddress(), true);

      const amountIn = ethers.parseEther("50");
      const expectedOut = ethers.parseEther("50");

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

      expect(await targetAsset.balanceOf(user.address)).to.equal(expectedOut);
    });

    it("allows governance to revoke an asset approval", async function () {
      await autonomousHarvester.connect(owner).setAssetApproval(await targetAsset.getAddress(), false);
      await expect(
        autonomousHarvester.connect(aiKeeper).executeAutonomousRebalance(
          user.address,
          await sourceAsset.getAddress(),
          await targetAsset.getAddress(),
          ethers.parseEther("5"),
          ethers.parseEther("4.5")
        )
      ).to.be.revertedWith("Target asset not approved");
    });

    it("restricts asset approval changes to the owner", async function () {
      await expect(
        autonomousHarvester.connect(user).setAssetApproval(await targetAsset.getAddress(), true)
      ).to.be.revertedWithCustomError(autonomousHarvester, "OwnableUnauthorizedAccount");
    });
  });
});
