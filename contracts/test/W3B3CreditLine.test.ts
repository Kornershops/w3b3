import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3CreditLine, MockERC20, MockPriceOracle } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("W3B3CreditLine", function () {
  let creditLine: W3B3CreditLine;
  let borrowAsset: MockERC20;
  let collateralAsset: MockERC20;
  let oracle: MockPriceOracle;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let liquidator: HardhatEthersSigner;

  const initialPrice = ethers.parseEther("1000");

  beforeEach(async function () {
    [owner, user, liquidator] = await ethers.getSigners();
    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    borrowAsset = await ERC20Factory.deploy("Stablecoin", "USDC", 18) as unknown as MockERC20;
    collateralAsset = await ERC20Factory.deploy("Staked Ether", "stETH", 18) as unknown as MockERC20;
    const OracleFactory = await ethers.getContractFactory("MockPriceOracle");
    oracle = await OracleFactory.deploy(initialPrice) as unknown as MockPriceOracle;
    const CreditLineFactory = await ethers.getContractFactory("W3B3CreditLine");
    creditLine = await CreditLineFactory.deploy(await borrowAsset.getAddress(), await collateralAsset.getAddress(), await oracle.getAddress(), owner.address) as unknown as W3B3CreditLine;
    await borrowAsset.mint(await creditLine.getAddress(), ethers.parseEther("100000"));
    await borrowAsset.mint(liquidator.address, ethers.parseEther("10000"));
    await collateralAsset.mint(user.address, ethers.parseEther("10"));
    await borrowAsset.connect(liquidator).approve(await creditLine.getAddress(), ethers.MaxUint256);
    await collateralAsset.connect(user).approve(await creditLine.getAddress(), ethers.MaxUint256);
  });

  describe("Configuration safety", function () {
    it("rejects externally owned asset addresses", async function () {
      const CreditLineFactory = await ethers.getContractFactory("W3B3CreditLine");
      await expect(CreditLineFactory.deploy(owner.address, await collateralAsset.getAddress(), await oracle.getAddress(), owner.address)).to.be.revertedWithCustomError(CreditLineFactory, "InvalidAsset");
      await expect(CreditLineFactory.deploy(await borrowAsset.getAddress(), owner.address, await oracle.getAddress(), owner.address)).to.be.revertedWithCustomError(CreditLineFactory, "InvalidAsset");
    });

    it("rejects an externally owned address as the initial oracle", async function () {
      const CreditLineFactory = await ethers.getContractFactory("W3B3CreditLine");
      await expect(CreditLineFactory.deploy(await borrowAsset.getAddress(), await collateralAsset.getAddress(), owner.address, owner.address)).to.be.revertedWithCustomError(CreditLineFactory, "InvalidOracle");
    });
  });

  describe("Oracle safety", function () {
    it("rejects an initial oracle with a zero price", async function () {
      const OracleFactory = await ethers.getContractFactory("MockPriceOracle");
      const invalidOracle = await OracleFactory.deploy(initialPrice) as unknown as MockPriceOracle;
      const address = await invalidOracle.getAddress();
      await ethers.provider.send("hardhat_setStorageAt", [address, "0x0", ethers.zeroPadValue("0x00", 32)]);
      const CreditLineFactory = await ethers.getContractFactory("W3B3CreditLine");
      await expect(CreditLineFactory.deploy(await borrowAsset.getAddress(), await collateralAsset.getAddress(), address, owner.address)).to.be.revertedWithCustomError(CreditLineFactory, "InvalidOraclePrice");
    });

    it("rejects an oracle with a future observation during rotation", async function () {
      const OracleFactory = await ethers.getContractFactory("MockPriceOracle");
      const replacement = await OracleFactory.deploy(initialPrice) as unknown as MockPriceOracle;
      const address = await replacement.getAddress();
      const block = await ethers.provider.getBlock("latest");
      await ethers.provider.send("hardhat_setStorageAt", [address, "0x1", ethers.zeroPadValue(ethers.toBeHex(BigInt((block?.timestamp ?? 0) + 3600)), 32)]);
      await expect(creditLine.connect(owner).setPriceOracle(address)).to.be.revertedWithCustomError(creditLine, "InvalidOraclePrice");
    });

    it("rejects an oracle with an invalid timestamp during rotation", async function () {
      const OracleFactory = await ethers.getContractFactory("MockPriceOracle");
      const replacement = await OracleFactory.deploy(initialPrice) as unknown as MockPriceOracle;
      const address = await replacement.getAddress();
      await ethers.provider.send("hardhat_setStorageAt", [address, "0x1", ethers.zeroPadValue("0x00", 32)]);
      await expect(creditLine.connect(owner).setPriceOracle(address)).to.be.revertedWithCustomError(creditLine, "InvalidOraclePrice");
    });

    it("rejects a previously valid oracle after its observation becomes future-dated", async function () {
      const currentOracle = await oracle.getAddress();
      const block = await ethers.provider.getBlock("latest");
      await ethers.provider.send("hardhat_setStorageAt", [currentOracle, "0x1", ethers.zeroPadValue(ethers.toBeHex(BigInt((block?.timestamp ?? 0) + 3600)), 32)]);
      await expect(creditLine.connect(user).borrow(ethers.parseEther("1"))).to.be.revertedWithCustomError(creditLine, "InvalidOraclePrice");
    });

    it("rejects a previously valid oracle after its observation timestamp is cleared", async function () {
      const currentOracle = await oracle.getAddress();
      await ethers.provider.send("hardhat_setStorageAt", [currentOracle, "0x1", ethers.zeroPadValue("0x00", 32)]);
      await expect(creditLine.connect(user).depositCollateral(ethers.parseEther("1"))).to.not.be.reverted;
      await expect(creditLine.connect(user).borrow(ethers.parseEther("1"))).to.be.revertedWithCustomError(creditLine, "InvalidOraclePrice");
    });

    it("allows governance to rotate to a valid oracle", async function () {
      const OracleFactory = await ethers.getContractFactory("MockPriceOracle");
      const replacement = await OracleFactory.deploy(initialPrice) as unknown as MockPriceOracle;
      await expect(creditLine.connect(owner).setPriceOracle(await replacement.getAddress())).to.emit(creditLine, "PriceOracleUpdated");
      expect(await creditLine.priceOracle()).to.equal(await replacement.getAddress());
    });
  });

  describe("Access and amount guards", function () {
    it("restricts oracle rotation to the owner", async function () {
      await expect(creditLine.connect(user).setPriceOracle(await oracle.getAddress())).to.be.revertedWithCustomError(creditLine, "OwnableUnauthorizedAccount");
    });

    it("rejects zero collateral deposits and zero borrows", async function () {
      await expect(creditLine.connect(user).depositCollateral(0)).to.be.revertedWith("Amount must be > 0");
      await expect(creditLine.connect(user).borrow(0)).to.be.revertedWith("Amount must be > 0");
    });

    it("rejects zero liquidation and zero repayment when there is no debt", async function () {
      await expect(creditLine.connect(liquidator).liquidate(user.address, 0)).to.be.revertedWith("Position is healthy");
      await expect(creditLine.connect(user).repay(0)).to.be.revertedWith("No debt to repay");
    });
  });

  describe("Collateral and debt invariants", function () {
    it("prevents borrowing beyond MAX_LTV", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await expect(creditLine.connect(user).borrow(ethers.parseEther("1001"))).to.be.revertedWith("LTV exceeded");
    });

    it("prevents withdrawal that would violate MAX_LTV", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));
      await expect(creditLine.connect(user).withdrawCollateral(ethers.parseEther("0.01"))).to.be.revertedWith("LTV exceeded after withdrawal");
    });

    it("caps repayment at outstanding debt", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("100"));
      await borrowAsset.mint(user.address, ethers.parseEther("200"));
      await borrowAsset.connect(user).approve(await creditLine.getAddress(), ethers.MaxUint256);
      await creditLine.connect(user).repay(ethers.parseEther("200"));
      const pos = await creditLine.positions(user.address);
      expect(pos.borrowedAmount).to.equal(0);
    });

    it("liquidates only an unhealthy position and caps collateral seizure", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));
      await expect(creditLine.connect(liquidator).liquidate(user.address, ethers.parseEther("100"))).to.be.revertedWith("Position is healthy");
      await oracle.setPrice(ethers.parseEther("400"));
      await creditLine.connect(liquidator).liquidate(user.address, ethers.parseEther("1000"));
      const pos = await creditLine.positions(user.address);
      expect(pos.collateralAmount).to.equal(0);
      expect(pos.borrowedAmount).to.be.gte(0);
    });
  });

  describe("Interest", function () {
    it("accrues non-negative interest over elapsed time", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));
      const before = await creditLine.positions(user.address);
      await time.increase(365 * 24 * 60 * 60);
      await borrowAsset.mint(user.address, ethers.parseEther("100"));
      await borrowAsset.connect(user).approve(await creditLine.getAddress(), ethers.MaxUint256);
      await creditLine.connect(user).repay(ethers.parseEther("1"));
      const after = await creditLine.positions(user.address);
      expect(after.borrowedAmount).to.be.gt(before.borrowedAmount - ethers.parseEther("1"));
    });
  });
});