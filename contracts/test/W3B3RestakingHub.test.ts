import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3RestakingHub, MockERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("W3B3RestakingHub (Cross-Chain Restaking)", function () {
  let restakingHub: W3B3RestakingHub;
  let underlyingLST: MockERC20;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let mockEigenLayerManager: HardhatEthersSigner;

  const OPERATOR_ID = ethers.id("solana-eigenlayer-operator");

  beforeEach(async function () {
    [owner, user, mockEigenLayerManager] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    underlyingLST = await ERC20Factory.deploy("Liquid Staked Token", "LST", 18) as unknown as MockERC20;

    const RestakingHubFactory = await ethers.getContractFactory("W3B3RestakingHub");
    restakingHub = await RestakingHubFactory.deploy(
      await underlyingLST.getAddress(),
      mockEigenLayerManager.address,
      owner.address
    ) as unknown as W3B3RestakingHub;

    // Provide user with LSTs
    await underlyingLST.mint(user.address, ethers.parseEther("100"));
    
    // Provide restaking hub with initial instant withdrawal float for tests
    await underlyingLST.mint(await restakingHub.getAddress(), ethers.parseEther("1000"));

    // User approves hub
    await underlyingLST.connect(user).approve(await restakingHub.getAddress(), ethers.MaxUint256);
  });

  describe("Deposit and Restake", function () {
    it("Should allow user to deposit LSTs and delegate natively to cross-chain operator", async function () {
      const depositAmount = ethers.parseEther("50");

      await expect(
        restakingHub.connect(user).depositAndRestake(depositAmount, OPERATOR_ID)
      ).to.emit(restakingHub, "CrossChainRestaked")
       .withArgs(user.address, depositAmount, OPERATOR_ID)
       .and.to.emit(restakingHub, "InternalEigenLayerSync")
       .withArgs(mockEigenLayerManager.address, depositAmount);

      // Verify state mapping
      const pos = await restakingHub.restakedPositions(user.address);
      expect(pos.amount).to.equal(depositAmount);
      expect(pos.targetOperatorId).to.equal(OPERATOR_ID);

      // Assure tokens were securely routed inside the mock delegation manager interface
      const managerBalance = await underlyingLST.balanceOf(mockEigenLayerManager.address);
      expect(managerBalance).to.equal(depositAmount);
    });
  });

  describe("Withdrawal Operations", function () {
    it("Should allow user to withdraw restaked capital through mock float", async function () {
      const depositAmount = ethers.parseEther("50");
      await restakingHub.connect(user).depositAndRestake(depositAmount, OPERATOR_ID);

      // Withdraw exactly 50
      await expect(
        restakingHub.connect(user).withdrawRestake(depositAmount)
      ).to.emit(restakingHub, "RestakeWithdrawn")
       .withArgs(user.address, depositAmount);

      // Mapping reduces cleanly to 0
      const pos = await restakingHub.restakedPositions(user.address);
      expect(pos.amount).to.equal(0);
    });

    it("Should revert if user tries to withdraw more than staked", async function () {
        const depositAmount = ethers.parseEther("50");
        await restakingHub.connect(user).depositAndRestake(depositAmount, OPERATOR_ID);
  
        await expect(
          restakingHub.connect(user).withdrawRestake(ethers.parseEther("51"))
        ).to.be.revertedWith("Insufficient restaked balance");
    });
  });
});
