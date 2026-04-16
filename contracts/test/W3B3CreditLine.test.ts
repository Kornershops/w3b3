import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3CreditLine, MockERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("W3B3CreditLine", function () {
  let creditLine: W3B3CreditLine;
  let borrowAsset: MockERC20;
  let collateralAsset: MockERC20;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let liquidator: HardhatEthersSigner;

  const initialPrice = ethers.parseEther("1000"); // $1000 per collateral asset

  beforeEach(async function () {
    [owner, user, liquidator] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    borrowAsset = await ERC20Factory.deploy("Stablecoin", "USDC", 18) as unknown as MockERC20;
    collateralAsset = await ERC20Factory.deploy("Staked Ether", "stETH", 18) as unknown as MockERC20;

    const CreditLineFactory = await ethers.getContractFactory("W3B3CreditLine");
    creditLine = await CreditLineFactory.deploy(
      await borrowAsset.getAddress(),
      await collateralAsset.getAddress(),
      initialPrice,
      owner.address
    ) as unknown as W3B3CreditLine;

    // Mint some assets
    await borrowAsset.mint(await creditLine.getAddress(), ethers.parseEther("100000"));
    await borrowAsset.mint(liquidator.address, ethers.parseEther("10000"));
    await collateralAsset.mint(user.address, ethers.parseEther("10")); // 10 stETH = $10,000

    // Approvals
    await borrowAsset.connect(liquidator).approve(await creditLine.getAddress(), ethers.MaxUint256);
    await collateralAsset.connect(user).approve(await creditLine.getAddress(), ethers.MaxUint256);
  });

  describe("Deposit & Borrow", function () {
    it("Should allow user to deposit collateral and borrow", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2")); 
      // 2 stETH deposited = $2000 value. Max LTV 50% = $1000 borrow limit.

      await creditLine.connect(user).borrow(ethers.parseEther("1000"));
      
      const pos = await creditLine.positions(user.address);
      expect(pos.collateralAmount).to.equal(ethers.parseEther("2"));
      expect(pos.borrowedAmount).to.equal(ethers.parseEther("1000"));
    });

    it("Should prevent borrowing beyond MAX_LTV", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      
      // Attempt to borrow $1001 (Limit is $1000)
      await expect(
        creditLine.connect(user).borrow(ethers.parseEther("1001"))
      ).to.be.revertedWith("LTV exceeded");
    });
  });

  describe("Interest Accrual and Repayment", function () {
    it("Should accrue interest over time", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2"));
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));

      // Advance time by 1 year
      await time.increase(365 * 24 * 60 * 60);

      // Trigger update (e.g. by borrowing 0 or another small amount)
      await borrowAsset.mint(user.address, ethers.parseEther("100"));
      await borrowAsset.connect(user).approve(await creditLine.getAddress(), ethers.MaxUint256);
      
      // Repay 1 USDC, this triggers interest accrual and recalculation
      await creditLine.connect(user).repay(ethers.parseEther("1"));

      const pos = await creditLine.positions(user.address);
      // Interest on 1000 a 2% per year = 20. Then repaid 1, so 1000 + 20 - 1 = 1019
      expect(pos.borrowedAmount).to.be.closeTo(ethers.parseEther("1019"), ethers.parseEther("0.1"));
    });
  });

  describe("Liquidation", function () {
    it("Should liquidate position if health factor drops", async function () {
      await creditLine.connect(user).depositCollateral(ethers.parseEther("2")); // $2000 value
      await creditLine.connect(user).borrow(ethers.parseEther("1000"));

      // Price drops to $400. Collateral = $800.
      // Debt = 1000. LTV > 60% threshold (1000/800 = 125%)
      await creditLine.connect(owner).setMockPrice(ethers.parseEther("400"));

      // Liquidator covers 500 debt
      const debtToCover = ethers.parseEther("500");
      await expect(
        creditLine.connect(liquidator).liquidate(user.address, debtToCover)
      ).to.emit(creditLine, "Liquidated");

      const pos = await creditLine.positions(user.address);
      expect(pos.borrowedAmount).to.be.closeTo(ethers.parseEther("500"), ethers.parseEther("0.0001")); 
    });
  });
});
