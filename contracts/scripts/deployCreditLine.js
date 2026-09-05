import { ethers } from 'hardhat';

const ORACLE_ABI = [
  'function getPrice() view returns (uint256 price, uint256 updatedAt)',
  'function feed() view returns (address)',
  'function maxAge() view returns (uint256)',
];

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function requiredAddress(name) {
  const value = required(name);
  if (!ethers.isAddress(value) || value === ethers.ZeroAddress) {
    throw new Error(`${name} must be a non-zero EVM address`);
  }
  return value;
}

function requiredUint(name) {
  const value = required(name);
  if (!/^\d+$/.test(value)) throw new Error(`${name} must be a non-negative integer`);
  return BigInt(value);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const expectedChainId = requiredUint('CREDIT_EXPECTED_CHAIN_ID');
  if (network.chainId !== expectedChainId) {
    throw new Error(`Wrong network: expected chain ${expectedChainId}, connected to ${network.chainId}`);
  }

  const borrowAsset = requiredAddress('CREDIT_BORROW_ASSET');
  const collateralAsset = requiredAddress('CREDIT_COLLATERAL_ASSET');
  const oracle = requiredAddress('CREDIT_ORACLE');
  const expectedFeed = requiredAddress('CREDIT_ORACLE_FEED');
  const expectedMaxAge = requiredUint('CREDIT_ORACLE_MAX_AGE_SECONDS');
  const owner = process.env.CREDIT_OWNER || deployer.address;

  if (!ethers.isAddress(owner) || owner === ethers.ZeroAddress) {
    throw new Error('CREDIT_OWNER must be a non-zero EVM address');
  }
  if (expectedMaxAge === 0n) throw new Error('CREDIT_ORACLE_MAX_AGE_SECONDS must be greater than zero');

  const oracleCode = await ethers.provider.getCode(oracle);
  if (oracleCode === '0x') {
    throw new Error(`CREDIT_ORACLE has no deployed contract code: ${oracle}`);
  }

  const oracleContract = new ethers.Contract(oracle, ORACLE_ABI, ethers.provider);
  const [feed, maxAge] = await Promise.all([
    oracleContract.feed(),
    oracleContract.maxAge(),
  ]);

  if (feed.toLowerCase() !== expectedFeed.toLowerCase()) {
    throw new Error(`CREDIT_ORACLE feed mismatch: expected ${expectedFeed}, got ${feed}`);
  }
  if (maxAge !== expectedMaxAge) {
    throw new Error(`CREDIT_ORACLE maxAge mismatch: expected ${expectedMaxAge}, got ${maxAge}`);
  }

  const feedCode = await ethers.provider.getCode(feed);
  if (feedCode === '0x') throw new Error(`CREDIT_ORACLE_FEED has no deployed contract code: ${feed}`);

  const [price, updatedAt] = await oracleContract.getPrice();
  if (price <= 0n || updatedAt === 0n) {
    throw new Error('CREDIT_ORACLE did not return a valid live price observation');
  }

  const now = BigInt(Math.floor(Date.now() / 1000));
  if (updatedAt > now) {
    throw new Error('CREDIT_ORACLE returned a future-dated observation');
  }
  if (now - updatedAt > maxAge) {
    throw new Error(`CREDIT_ORACLE observation is stale: age=${now - updatedAt}s maxAge=${maxAge}s`);
  }

  const factory = await ethers.getContractFactory('W3B3CreditLine');
  const creditLine = await factory.deploy(borrowAsset, collateralAsset, oracle, owner);
  await creditLine.waitForDeployment();

  const address = await creditLine.getAddress();
  console.log(JSON.stringify({
    network: network.name,
    chainId: network.chainId.toString(),
    creditLine: address,
    borrowAsset,
    collateralAsset,
    oracle,
    oracleFeed: feed,
    oracleMaxAgeSeconds: maxAge.toString(),
    oraclePrice: price.toString(),
    oracleUpdatedAt: updatedAt.toString(),
    owner,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  }, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
