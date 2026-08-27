import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainlinkPriceOracle, MockAggregatorV3 } from "../typechain-types";

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

  it("rejects a zero feed address", async function () {
    const OracleFactory = await ethers.getContractFactory("ChainlinkPriceOracle");
    await expect(OracleFactory.deploy(ethers.ZeroAddress, 3600)).to.be.revertedWithCustomError(OracleFactory, "InvalidFeed");
  });

  it("rejects an externally owned address as a feed", async function () {
    const [, eoa] = await ethers.getSigners();
    const OracleFactory = await ethers.getContractFactory("ChainlinkPriceOracle");
    await expect(OracleFactory.deploy(eoa.address, 3600)).to.be.revertedWithCustomError(OracleFactory, "InvalidFeed");
  });

  it("rejects a zero max age", async function () {
    const OracleFactory = await ethers.getContractFactory("ChainlinkPriceOracle");
    await expect(OracleFactory.deploy(await feed.getAddress(), 0)).to.be.revertedWithCustomError(OracleFactory, "InvalidFeed");
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

  it("rejects future-dated observations", async function () {
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    await feed.setUpdatedAt(now + 7200);
    await expect(oracle.getPrice()).to.be.revertedWithCustomError(oracle, "StalePrice");
  });

  it("rejects zero rounds", async function () {
    await feed.setRound(0);
    await expect(oracle.getPrice()).to.be.revertedWithCustomError(oracle, "IncompleteRound");
  });

  it("rejects observations answered by an older round", async function () {
    await feed.setRoundData(5, 4);
    await expect(oracle.getPrice()).to.be.revertedWithCustomError(oracle, "IncompleteRound");
  });
});
