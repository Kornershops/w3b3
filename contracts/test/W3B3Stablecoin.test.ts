import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3PositionNFT, W3B3Stablecoin } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("W3B3Stablecoin", function () {
  let positionNFT: W3B3PositionNFT;
  let stablecoin: W3B3Stablecoin;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let mockStakingPool: HardhatEthersSigner;

  const UNDERLYING_ASSET = "0x0000000000000000000000000000000000000001"; 

  beforeEach(async function () {
    [owner, user, mockStakingPool] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("W3B3PositionNFT");
    positionNFT = await NFTFactory.deploy(owner.address) as unknown as W3B3PositionNFT;
    await positionNFT.connect(owner).setStakingPool(mockStakingPool.address);

    const StablecoinFactory = await ethers.getContractFactory("W3B3Stablecoin");
    stablecoin = await StablecoinFactory.deploy(
      await positionNFT.getAddress(),
      owner.address
    ) as unknown as W3B3Stablecoin;
  });

  describe("Mint and Burn Stablecoins", function () {
    it("Should allow a user to mint w3USD against their NFT", async function () {
      // 1. Mint NFT to User
      const principal = ethers.parseEther("150"); // $150
      await positionNFT.connect(mockStakingPool).mintPosition(
        user.address,
        principal,
        UNDERLYING_ASSET,
        (await time.latest()) + 86400,
        1000
      );

      // Approve NFT to be handled by stablecoin contract
      await positionNFT.connect(user).approve(await stablecoin.getAddress(), 1);

      // 2. Mint w3USD 
      // 15000 is the 150% minimum collateral ratio. 150 / 1.5 = 100 max mintable.
      const mintAmount = ethers.parseEther("100");

      await expect(
        stablecoin.connect(user).mintAgainstPosition(1, mintAmount)
      ).to.emit(stablecoin, "Minted").withArgs(user.address, 1, mintAmount);

      // Check user balance
      expect(await stablecoin.balanceOf(user.address)).to.equal(mintAmount);

      // Check NFT is locked in the stablecoin contract
      expect(await positionNFT.ownerOf(1)).to.equal(await stablecoin.getAddress());
    });

    it("Should allow user to repay debt and unlock NFT", async function () {
      // Setup
      const principal = ethers.parseEther("150");
      await positionNFT.connect(mockStakingPool).mintPosition(
        user.address, principal, UNDERLYING_ASSET, 0, 0
      );
      await positionNFT.connect(user).approve(await stablecoin.getAddress(), 1);
      
      const mintAmount = ethers.parseEther("100");
      await stablecoin.connect(user).mintAgainstPosition(1, mintAmount);

      // Unlock
      await expect(
        stablecoin.connect(user).burnToUnlock(0) // index 0 in their array
      ).to.emit(stablecoin, "Burned").withArgs(user.address, 1, mintAmount);

      // Balance is 0
      expect(await stablecoin.balanceOf(user.address)).to.equal(0);

      // User owns the NFT again
      expect(await positionNFT.ownerOf(1)).to.equal(user.address);
    });

    it("Should prevent under-collateralized minting", async function () {
      const principal = ethers.parseEther("150");
      await positionNFT.connect(mockStakingPool).mintPosition(
        user.address, principal, UNDERLYING_ASSET, 0, 0
      );
      await positionNFT.connect(user).approve(await stablecoin.getAddress(), 1);
      
      // Try to mint 101, max is 100
      await expect(
        stablecoin.connect(user).mintAgainstPosition(1, ethers.parseEther("101"))
      ).to.be.revertedWith("Insufficient collateralization");
    });
  });
});
