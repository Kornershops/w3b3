import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Real Yield Ecosystem...");

  const [deployer] = await ethers.getSigners();
  console.log("Admin / Deployer Account:", deployer.address);

  // Configuration (Mock addresses for Testnet / Goerli - replace for Mainnet)
  const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; // Mainnet WETH is 0xC02...
  const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const W3B3_TOKEN_ADDRESS = "0x..."; // Replace with real deployed $W3B3

  // 1. Deploy Treasury
  console.log("\n1. Deploying W3B3Treasury...");
  const TreasuryFactory = await ethers.getContractFactory("W3B3Treasury");
  const treasury = await TreasuryFactory.deploy(deployer.address);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log(`W3B3Treasury deployed to: ${treasuryAddress}`);

  // 2. Deploy RewardDistributor
  console.log("\n2. Deploying W3B3RewardDistributor...");
  const DistributorFactory = await ethers.getContractFactory("W3B3RewardDistributor");
  const distributor = await DistributorFactory.deploy(W3B3_TOKEN_ADDRESS, WETH_ADDRESS);
  await distributor.waitForDeployment();
  const distributorAddress = await distributor.getAddress();
  console.log(`W3B3RewardDistributor deployed to: ${distributorAddress}`);

  // 3. Deploy RevenueRouter
  console.log("\n3. Deploying RevenueRouter...");
  const RouterFactory = await ethers.getContractFactory("RevenueRouter");
  const revenueRouter = await RouterFactory.deploy(
    deployer.address,
    treasuryAddress,
    UNISWAP_V3_ROUTER,
    WETH_ADDRESS,
    distributorAddress
  );
  await revenueRouter.waitForDeployment();
  const routerAddress = await revenueRouter.getAddress();
  console.log(`RevenueRouter deployed to: ${routerAddress}`);

  // 4. Permissions Setup
  console.log("\n4. Transferring Privileges...");
  await treasury.transferOwnership(routerAddress);
  await distributor.transferOwnership(routerAddress);
  console.log("RevenueRouter now owns Treasury & Distributor components.");

  console.log("\n=== REAL YIELD DEPLOYMENT COMPLETE ===");
  console.log({
    W3B3Treasury: treasuryAddress,
    W3B3RewardDistributor: distributorAddress,
    RevenueRouter: routerAddress,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
