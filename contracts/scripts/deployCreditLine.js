import { ethers } from 'hardhat';

const ORACLE_ABI = [
  'function getPrice() view returns (uint256 price, uint256 updatedAt)',
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

async function main() {
  const [deployer] = await ethers.getSigners();
  const borrowAsset = requiredAddress('CREDIT_BORROW_ASSET');
  const collateralAsset = requiredAddress('CREDIT_COLLATERAL_ASSET');
  const oracle = requiredAddress('CREDIT_ORACLE');
  const owner = process.env.CREDIT_OWNER || deployer.address;

  if (!ethers.isAddress(owner) || owner === ethers.ZeroAddress) {
    throw new Error('CREDIT_OWNER must be a non-zero EVM address');
  }

  const oracleCode = await ethers.provider.getCode(oracle);
  if (oracleCode === '0x') {
    throw new Error(`CREDIT_ORACLE has no deployed contract code: ${oracle}`);
  }

  const oracleContract = new ethers.Contract(oracle, ORACLE_ABI, ethers.provider);
  const [price, updatedAt] = await oracleContract.getPrice();
  if (price <= 0n || updatedAt === 0n) {
    throw new Error('CREDIT_ORACLE did not return a valid live price observation');
  }

  const now = BigInt(Math.floor(Date.now() / 1000));
  if (updatedAt > now) {
    throw new Error('CREDIT_ORACLE returned a future-dated observation');
  }

  const factory = await ethers.getContractFactory('W3B3CreditLine');
  const creditLine = await factory.deploy(borrowAsset, collateralAsset, oracle, owner);
  await creditLine.waitForDeployment();

  const address = await creditLine.getAddress();
  console.log(JSON.stringify({
    network: (await ethers.provider.getNetwork()).name,
    creditLine: address,
    borrowAsset,
    collateralAsset,
    oracle,
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
