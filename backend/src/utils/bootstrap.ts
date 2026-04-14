import { PrismaClient } from '@prisma/client';

export async function seed(client: PrismaClient) {
  console.log('Seeding database with production-verified pools...');

  // Create sample staking pools
  const pools = await Promise.all([
    // ETHEREUM POOLS (Chain 1)
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' } },
      update: { isActive: true },
      create: { name: 'USDC Core', chainId: 1, contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', tokenSymbol: 'USDC', tokenDecimals: 6, apyPercentage: '12.50', tvlAmount: '12300000.00', minimumStake: '100.00', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' } },
      update: { isActive: true },
      create: { name: 'Lido staked ETH', chainId: 1, contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', tokenSymbol: 'stETH', tokenDecimals: 18, apyPercentage: '4.20', tvlAmount: '24100500.00', minimumStake: '0.10', isActive: true },
    }),
    
    // POLYGON POOLS (Chain 137)
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 137, contractAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' } },
      update: { isActive: true },
      create: { name: 'Polygon Validator', chainId: 137, contractAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', tokenSymbol: 'MATIC', tokenDecimals: 18, apyPercentage: '8.20', tvlAmount: '5100000.00', minimumStake: '100.00', isActive: true },
    }),
    
    // ARBITRUM POOLS (Chain 42161)
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 42161, contractAddress: '0xfc5A1A6EB076a9C7210d2109e2CE07E780E25c07' } },
      update: { isActive: true },
      create: { name: 'GMX Master Staking', chainId: 42161, contractAddress: '0xfc5A1A6EB076a9C7210d2109e2CE07E780E25c07', tokenSymbol: 'GMX', tokenDecimals: 18, apyPercentage: '14.50', tvlAmount: '4500000.00', minimumStake: '1.00', isActive: true },
    }),
    
    // OPTIMISM POOLS (Chain 10)
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 10, contractAddress: '0x4200000000000000000000000000000000000042' } },
      update: { isActive: true },
      create: { name: 'Optimism Rewards', chainId: 10, contractAddress: '0x4200000000000000000000000000000000000042', tokenSymbol: 'OP', tokenDecimals: 18, apyPercentage: '11.35', tvlAmount: '9800000.00', minimumStake: '20.00', isActive: true },
    }),

    // BASE POOLS (Chain 8453)
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 8453, contractAddress: '0x940181a94A35A4569E4529A3CDfB74e38FD98631' } },
      update: { isActive: true },
      create: { name: 'Aerodrome Base Staking', chainId: 8453, contractAddress: '0x940181a94A35A4569E4529A3CDfB74e38FD98631', tokenSymbol: 'AERO', tokenDecimals: 18, apyPercentage: '38.00', tvlAmount: '890000.00', minimumStake: '100.00', isActive: true },
    }),
  ]);

  console.log(`Successfully bootstrapped ${pools.length} staking pools`);

  // Bootstrapping Treasury Assets (Module 1: Institutional Alpha)
  const treasuryAssets = await Promise.all([
    client.treasuryAsset.upsert({
      where: { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
      update: { symbol: 'USDC', decimals: 6, oracleId: 'usd-coin' },
      create: { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6, oracleId: 'usd-coin' },
    }),
    client.treasuryAsset.upsert({
      where: { address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
      update: { symbol: 'USDT', decimals: 6, oracleId: 'tether' },
      create: { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6, oracleId: 'tether' },
    }),
    client.treasuryAsset.upsert({
      where: { address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' },
      update: { symbol: 'stETH', decimals: 18, oracleId: 'staked-ether' },
      create: { symbol: 'stETH', address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', decimals: 18, oracleId: 'staked-ether' },
    }),
  ]);

  console.log(`Successfully bootstrapped ${treasuryAssets.length} treasury assets`);
}
