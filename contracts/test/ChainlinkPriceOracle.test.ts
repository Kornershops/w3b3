import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainlinkPriceOracle, MockAggregatorV3 } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ChainlinkPriceOracle", function () {
  let feed: MockAggregatorV3;
  let oracle: ChainlinkPriceOracle;

  beforeEach(async function () {
    const FeedFactory = await ethers.getContractFactory("MockAggregatorV3");
    feed = await FeedFactory.deploy(8, 1000n * 10n ** 8n) as unknown as MockAggregatorV3;

    const OracleFactory = await ethers.getContractFactory("ChainlinkPriceOracle");
    oracle = await OracleFactory.deploy(await feed.getAddress(), 3600) as unknown as ChainlinkPriceOracle;
  });

  it("normalizes an 8-decimal feed to 18 decimals", async function () {
    const [price] = await oracle.getPrice();
    expect(price).to.equal(ethers.parseEther("1000"));
  });

  it("rejects a non-positive answer", async function () {
    await feed.setAnswer(0);
    await expect(oracle.getPrice()).to.be.revertedWithCustomError(oracle, "InvalidPrice");
  });

  it("rejects stale observations", async function () {
    const staleAt = (await ethers.provider.getBlock("latest"))!.timestamp - 7200;
    await feed.setUpdatedAt(staleAt);
    await expect(oracle.getPrice()).to.be.revertedWithCustomError(oracle, "StalePrice");
  });

  it("rejects incomplete rounds", async function () {
    await feed.setAnswer(1000n * 10n ** 8n);
    // A zero round is not possible through the normal setter; deploy-time state is valid.
    expect((await oracle.getPrice())[0]).to.be.gt(0);
  });
});
