import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying StakingPool contract...');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  // Get balance
  const balance = await deployer.provider?.getBalance(deployer.address);
  console.log('Account balance:', ethers.formatEther(balance || 0), 'ETH');

  // Deploy StakingPool
  const StakingPool = await ethers.getContractFactory('StakingPool');

  // Example: Deploy with USDC and reward token
  // Replace these addresses with actual token addresses
  const STAKING_TOKEN = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC on Ethereum
  const REWARD_TOKEN = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC as reward
  const REWARD_RATE = ethers.parseEther('0.00001'); // 0.00001 tokens per second

  const stakingPool = await StakingPool.deploy(
    STAKING_TOKEN,
    REWARD_TOKEN,
    REWARD_RATE
  );

  await stakingPool.waitForDeployment();

  const address = await stakingPool.getAddress();
  console.log('StakingPool deployed to:', address);

  // Verify on Etherscan (if on mainnet/testnet)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log('Waiting for block confirmations...');
    await stakingPool.deploymentTransaction()?.wait(5);

    console.log('Verifying contract on Etherscan...');
    try {
      await ethers.verify(address, [
        STAKING_TOKEN,
        REWARD_TOKEN,
        REWARD_RATE,
      ]);
      console.log('Contract verified on Etherscan');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    stakingPool: address,
    stakingToken: STAKING_TOKEN,
    rewardToken: REWARD_TOKEN,
    rewardRate: REWARD_RATE.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log('\nDeployment Info:');
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
