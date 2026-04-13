import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3InsuranceWrapper, MockERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("W3B3InsuranceWrapper", function () {
  let insuranceWrapper: W3B3InsuranceWrapper;
  let stakingToken: MockERC20;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let insuranceFund: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user, insuranceFund] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    stakingToken = await ERC20Factory.deploy("Staked Ether", "stETH", 18) as unknown as MockERC20;

    const InsuranceWrapperFactory = await ethers.getContractFactory("W3B3InsuranceWrapper");
    insuranceWrapper = await InsuranceWrapperFactory.deploy(
      await stakingToken.getAddress(),
      insuranceFund.address,
      owner.address
    ) as unknown as W3B3InsuranceWrapper;

    // Mint some assets
    await stakingToken.mint(user.address, ethers.parseEther("100"));

    // Approvals
    await stakingToken.connect(user).approve(await insuranceWrapper.getAddress(), ethers.MaxUint256);
  });

  describe("Wrapping and Insurance Logic", function () {
    it("Should deduct premium and wrap successfully", async function () {
      const wrapAmount = ethers.parseEther("100");
      // 100 bp = 1% premium. Premium = 1 stETH.
      // Net active balance should be 99 stETH.

      await expect(
        insuranceWrapper.connect(user).wrapAndInsure(wrapAmount)
      ).to.emit(insuranceWrapper, "PositionInsured")
       .withArgs(user.address, ethers.parseEther("99"), ethers.parseEther("1"));

      const pos = await insuranceWrapper.positions(user.address);
      expect(pos.activeBalance).to.equal(ethers.parseEther("99"));
      expect(pos.insuredValue).to.equal(ethers.parseEther("100"));

      // Check insurance fund received the premium
      const fundBalance = await stakingToken.balanceOf(insuranceFund.address);
      expect(fundBalance).to.equal(ethers.parseEther("1"));
    });

    it("Should allow user to unwrap active balance", async function () {
      await insuranceWrapper.connect(user).wrapAndInsure(ethers.parseEther("100"));

      await expect(
        insuranceWrapper.connect(user).unwrap(ethers.parseEther("50"))
      ).to.emit(insuranceWrapper, "PositionUnwrapped")
       .withArgs(user.address, ethers.parseEther("50"));

      const pos = await insuranceWrapper.positions(user.address);
      expect(pos.activeBalance).to.equal(ethers.parseEther("49"));
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update premium", async function () {
      await insuranceWrapper.connect(owner).setPremium(200); // 2%
      expect(await insuranceWrapper.insurancePremiumBp()).to.equal(200);
    });

    it("Should allow owner to update insurance fund", async function () {
      const [, , , newFund] = await ethers.getSigners();
      await insuranceWrapper.connect(owner).setInsuranceFund(newFund.address);
      expect(await insuranceWrapper.insuranceFund()).to.equal(newFund.address);
    });

    it("Should prevent non-owners from updating config", async function () {
      await expect(
        insuranceWrapper.connect(user).setPremium(50)
      ).to.be.reverted;
    });
  });
});
