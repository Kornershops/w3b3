import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3PositionNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("W3B3PositionNFT", function () {
  let positionNFT: W3B3PositionNFT;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;
  let mockStakingPool: HardhatEthersSigner;

  const UNDERLYING_ASSET = "0x0000000000000000000000000000000000000001"; // Mock address

  beforeEach(async function () {
    [owner, user, buyer, mockStakingPool] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("W3B3PositionNFT");
    positionNFT = await NFTFactory.deploy(owner.address) as unknown as W3B3PositionNFT;

    // Set the staking pool mapping to our mock pool address
    await positionNFT.connect(owner).setStakingPool(mockStakingPool.address);
  });

  describe("Minting and Metdata", function () {
    it("Should allow the authorized staking pool to mint positions", async function () {
      const principal = ethers.parseEther("10"); // 10 tokens
      const lockUntil = (await time.latest()) + 30 * 24 * 60 * 60; // 30 days
      const apy = 1200; // 12%

      await expect(
        positionNFT.connect(mockStakingPool).mintPosition(
          user.address,
          principal,
          UNDERLYING_ASSET,
          lockUntil,
          apy
        )
      ).to.emit(positionNFT, "PositionMinted").withArgs(user.address, 1, principal, lockUntil);

      expect(await positionNFT.ownerOf(1)).to.equal(user.address);
      
      const pos = await positionNFT.getPositionDetails(1);
      expect(pos.principalAmount).to.equal(principal);
      expect(pos.underlyingAsset).to.equal(UNDERLYING_ASSET);
      expect(pos.lockedUntil).to.equal(lockUntil);
      expect(pos.apyAtMint).to.equal(apy);
    });

    it("Should prevent unauthorized minting", async function () {
      await expect(
        positionNFT.connect(user).mintPosition(
          user.address,
          ethers.parseEther("10"),
          UNDERLYING_ASSET,
          0,
          0
        )
      ).to.be.revertedWith("Only staking pool can mint");
    });
  });

  describe("Secondary Market Trading", function () {
    it("Should allow the user to transfer/sell their locked position", async function () {
      // Mint a position to User
      await positionNFT.connect(mockStakingPool).mintPosition(
        user.address,
        ethers.parseEther("10"),
        UNDERLYING_ASSET,
        (await time.latest()) + 86400,
        1000
      );

      expect(await positionNFT.ownerOf(1)).to.equal(user.address);

      // User transfers the NFT to buyer
      await positionNFT.connect(user).transferFrom(user.address, buyer.address, 1);

      // Verify the new owner is the buyer
      expect(await positionNFT.ownerOf(1)).to.equal(buyer.address);

      // The underlying metadata of the position should remain intact
      const pos = await positionNFT.getPositionDetails(1);
      expect(pos.principalAmount).to.equal(ethers.parseEther("10"));
    });
  });
});
