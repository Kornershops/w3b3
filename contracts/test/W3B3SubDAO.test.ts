import { expect } from "chai";
import { ethers } from "hardhat";
import { W3B3SubDAO, MockERC20 } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("W3B3SubDAO", function () {
  let subDao: W3B3SubDAO;
  let govToken: MockERC20;
  let targetContract: MockERC20; // Reusing mock token as a generic target
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("MockERC20");
    govToken = await ERC20Factory.deploy("Governance Token", "GOV", 18) as unknown as MockERC20;
    targetContract = await ERC20Factory.deploy("Target Protocol", "TGT", 18) as unknown as MockERC20;

    const SubDaoFactory = await ethers.getContractFactory("W3B3SubDAO");
    subDao = await SubDaoFactory.deploy(
      await govToken.getAddress(),
      owner.address
    ) as unknown as W3B3SubDAO;

    // Distribute voting power
    await govToken.mint(user.address, ethers.parseEther("150000")); // > 100k quorum
  });

  describe("Governance Lifecycle", function () {
    it("Should allow a full successful vote-and-execute sequence", async function () {
      // Create calldata for a mock `approve` call on Target Contract
      const abi = ["function approve(address spender, uint256 amount)"];
      const iface = new ethers.Interface(abi);
      const callData = iface.encodeFunctionData("approve", [user.address, ethers.parseEther("100")]);

      // 1. Propose
      await expect(
        subDao.connect(user).createProposal("Approve spending", await targetContract.getAddress(), callData)
      ).to.emit(subDao, "ProposalCreated").withArgs(0, "Approve spending", await targetContract.getAddress());

      // 2. Vote
      await expect(
        subDao.connect(user).vote(0, true) // Support
      ).to.emit(subDao, "Voted").withArgs(0, user.address, true, ethers.parseEther("150000"));

      // Try expanding before time ends
      await expect(
        subDao.connect(user).executeProposal(0)
      ).to.be.revertedWith("Voting is still active");

      // 3. Fast-forward past voting window (3 days)
      await time.increase(3 * 24 * 60 * 60 + 1);

      // 4. Execute
      await expect(
        subDao.connect(owner).executeProposal(0)
      ).to.emit(subDao, "ProposalExecuted").withArgs(0);

      // Verify the execution actually happened on Target
      const allowance = await targetContract.allowance(await subDao.getAddress(), user.address);
      expect(allowance).to.equal(ethers.parseEther("100"));
    });
  });
});
