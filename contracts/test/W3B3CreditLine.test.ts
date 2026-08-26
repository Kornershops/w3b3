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
    creditLine = await CreditLineFactory.deploy(
      await borrowAsset.getAddress(),
      await collateralAsset.getAddress(),
      await oracle.getAddress(),
      owner.address
    ) as unknown as W3B3CreditLine;

    await borrowAsset.mint(await creditLine.getAddress(), ethers.parseEther("100000"));
    await borrowAsset.mint(liquidator.address, ethers.parseEther("10000"));
    await collateralAsset.mint(user.address, ethers.parseEther("10"));

    await borrowAsset.connect(liquidator).approve(await creditLine.getAddress(), ethers.MaxUint256);
    await collateralAsset.connect(user).approve(await creditLine.getAddress(), ethers.MaxUint256);
  });

  describe("Oracle safety", function () {
    it("rejects an externally owned address as the initial oracle", async function () {
      const [eoa] = await ethers.getSigners();
      const CreditLineFactory = await ethers.getContractFactory("W3B3CreditLine");

      await expect(
        CreditLineFactory.deploy(
          await borrowAsset.getAddress(),
          await collateralAsset.getAddress(),
          eoa.address,
          owner.address
        )
      ).to.be.revertedWithCustomError(CreditLineFactory, "InvalidOracle");
    });

    it("uses the configured oracle rather than owner-controlled price state", async function () {
      expect(await creditLine.priceOracle()).to.equal(await oracle.getAddress());
      await expect(creditLine.connect(owner).setPriceOracle(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(creditLine, "InvalidOracle");
    });

    it("rejects an externally owned address during oracle rotation", async function () {
      const [eoa] = await ethers.getSigners();
      await expect(creditLine.connect(owner).setPriceOracle(eoa.address))
        .to.be.revertedWithCustomError(creditLine, "InvalidOracle");
    });

    it("allows governance to rotate the oracle address", async function () {
      const OracleFactory = await ethers.getContractFactory("MockPriceOracle");
      const replacement = await OracleFactory.deploy(initialPrice) as unknown as MockPriceOracle;

      await expect(creditLine.connect(owner).setPriceOracle(await replacement.getAddress()))
        .to.emit(creditLine, "PriceOracleUpdated");

      expect(await creditLine.priceOracle()).to.equal(await replacement.getAddress());
    });
  });

  describe("Deposit & Borrow", function () {
    it("allows user to deposit collateral and borrow", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));

      const pos = await creditLine.positions(user.address);
      expect(pos.collateralAmount).to.equal(ethers.parseEther("2"));
      expect(pos.borrowedAmount).to.equal(ethers.parseEther("1000"));
    });

    it("prevents borrowing beyond MAX_LTV", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await expect(
        creditLine.connect(user).borrow(ethers.parseEther("1001"))
      ).to.be.revertedWith("LTV exceeded");
    });
  });

  describe("Interest Accrual and Repayment", function () {
    it("accrues interest over time", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));
      await time.increase(365 * 24 * 60 * 60);

      await borrowAsset.mint(user.address, ethers.parseEther("100"));
      await borrowAsset.connect(user).approve(await creditLine.getAddress(), ethers.MaxUint256);
      await creditLine.connect(user).repay(ethers.parseEther("1"));

      const pos = await creditLine.positions(user.address);
      expect(pos.borrowedAmount).to.be.closeTo(ethers.parseEther("1019"), ethers.parseEther("0.1"));
    });
  });

  describe("Liquidation", function () {
    it("liquidates a position when the oracle price drops", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));

      await oracle.setPrice(ethers.parseEther("400"));

      const debtToCover = ethers.parseEther("500");
      await expect(
        creditLine.connect(liquidator).liquidate(user.address, debtToCover)
      ).to.emit(creditLine, "Liquidated");

      const pos = await creditLine.positions(user.address);
      expect(pos.borrowedAmount).to.be.closeTo(ethers.parseEther("500"), ethers.parseEther("0.0001"));
    });
  });
});
