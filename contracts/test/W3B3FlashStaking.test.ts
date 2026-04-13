import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3FlashStaking, MockSwapRouter, MockERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("W3B3FlashStaking", function () {
  let flashStaking: W3B3FlashStaking;
  let dexRouter: MockSwapRouter;
  let fromLST: MockERC20;
  let toLST: MockERC20;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let treasury: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user, treasury] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    fromLST = await ERC20Factory.deploy("Source LST", "sLST", 18) as unknown as MockERC20;
    toLST = await ERC20Factory.deploy("Target LST", "tLST", 18) as unknown as MockERC20;

    const RouterFactory = await ethers.getContractFactory("MockSwapRouter");
    dexRouter = await RouterFactory.deploy() as unknown as MockSwapRouter;

    const FlashStakingFactory = await ethers.getContractFactory("W3B3FlashStaking");
    flashStaking = await FlashStakingFactory.deploy(
      await dexRouter.getAddress(),
      treasury.address,
      owner.address
    ) as unknown as W3B3FlashStaking;

    // Provide user with source LST
    await fromLST.mint(user.address, ethers.parseEther("100"));
    
    // Provide Mock Router with destination LST so it can facilitate the swap
    await toLST.mint(await dexRouter.getAddress(), ethers.parseEther("1000"));

    // User approves FlashStaking Contract
    await fromLST.connect(user).approve(await flashStaking.getAddress(), ethers.MaxUint256);
  });

  describe("Swap Between Positions", function () {
    it("Should instantly swap source LST to target LST with fee deduction", async function () {
      const amountIn = ethers.parseEther("100");
      // Fee is 0.5% by default -> 0.5 sLST.
      // Net -> 99.5 sLST traded mapped 1:1 on mock router.
      const expectedOut = ethers.parseEther("99.5");

      await expect(
        flashStaking.connect(user).swapStakingPositions(
          await fromLST.getAddress(),
          await toLST.getAddress(),
          amountIn,
          expectedOut
        )
      ).to.emit(flashStaking, "FlashStakeSwapped")
       .withArgs(user.address, await fromLST.getAddress(), await toLST.getAddress(), amountIn, expectedOut);

      // Verify User received target tokens
      const userBalance = await toLST.balanceOf(user.address);
      expect(userBalance).to.equal(expectedOut);

      // Verify Treasury received the protocol fee
      const treasuryBalance = await fromLST.balanceOf(treasury.address);
      expect(treasuryBalance).to.equal(ethers.parseEther("0.5"));
    });

    it("Should allow owner to adjust flash fees", async function () {
      await flashStaking.connect(owner).setFlashFee(100); // 1%
      expect(await flashStaking.flashFeeBp()).to.equal(100);
    });
  });
});
