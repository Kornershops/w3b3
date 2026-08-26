import { ethers } from 'hardhat';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const borrowAsset = required('CREDIT_BORROW_ASSET');
  const collateralAsset = required('CREDIT_COLLATERAL_ASSET');
  const oracle = required('CREDIT_ORACLE');
  const owner = process.env.CREDIT_OWNER || deployer.address;

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
