import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample staking pools
  const pools = await Promise.all([
    // ETHEREUM POOLS (Chain 1)
    prisma.stakingPool.create({
      data: {
        name: 'USDC Core', chainId: 1, contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', tokenSymbol: 'USDC', tokenDecimals: 6, apyPercentage: '12.50', tvlAmount: '12300000.00', minimumStake: '100.00', isActive: true,
      },
    }),
    prisma.stakingPool.create({
      data: {
        name: 'Lido staked ETH', chainId: 1, contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', tokenSymbol: 'stETH', tokenDecimals: 18, apyPercentage: '4.20', tvlAmount: '24100500.00', minimumStake: '0.10', isActive: true,
      },
    }),
    prisma.stakingPool.create({
      data: {
        name: 'Tether Liquidity', chainId: 1, contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', tokenSymbol: 'USDT', tokenDecimals: 6, apyPercentage: '9.80', tvlAmount: '8700000.00', minimumStake: '50.00', isActive: true,
      },
    }),

    // POLYGON POOLS (Chain 137)
    prisma.stakingPool.create({
      data: {
        name: 'Polygon Validator', chainId: 137, contractAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', tokenSymbol: 'MATIC', tokenDecimals: 18, apyPercentage: '8.20', tvlAmount: '5100000.00', minimumStake: '100.00', isActive: true,
      },
    }),
    prisma.stakingPool.create({
      data: {
        name: 'Quickswap Yield', chainId: 137, contractAddress: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13', tokenSymbol: 'QUICK', tokenDecimals: 18, apyPercentage: '18.45', tvlAmount: '1200000.00', minimumStake: '5.00', isActive: true,
      },
    }),

    // ARBITRUM POOLS (Chain 42161)
    prisma.stakingPool.create({
      data: {
        name: 'GMX Master Staking', chainId: 42161, contractAddress: '0xfc5A1A6EB076a9C7210d2109e2CE07E780E25c07', tokenSymbol: 'GMX', tokenDecimals: 18, apyPercentage: '14.50', tvlAmount: '4500000.00', minimumStake: '1.00', isActive: true,
      },
    }),
    prisma.stakingPool.create({
      data: {
        name: 'Arbitrum DAO', chainId: 42161, contractAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548', tokenSymbol: 'ARB', tokenDecimals: 18, apyPercentage: '6.80', tvlAmount: '18300000.00', minimumStake: '50.00', isActive: true,
      },
    }),

    // OPTIMISM POOLS (Chain 10)
    prisma.stakingPool.create({
      data: {
        name: 'Synthetix SNX', chainId: 10, contractAddress: '0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4', tokenSymbol: 'SNX', tokenDecimals: 18, apyPercentage: '22.10', tvlAmount: '3600000.00', minimumStake: '10.00', isActive: true,
      },
    }),
    prisma.stakingPool.create({
      data: {
        name: 'Optimism Rewards', chainId: 10, contractAddress: '0x4200000000000000000000000000000000000042', tokenSymbol: 'OP', tokenDecimals: 18, apyPercentage: '11.35', tvlAmount: '9800000.00', minimumStake: '20.00', isActive: true,
      },
    }),

    // BASE POOLS (Chain 8453)
    prisma.stakingPool.create({
      data: {
        name: 'Aerodrome Base Staking', chainId: 8453, contractAddress: '0x940181a94A35A4569E4529A3CDfB74e38FD98631', tokenSymbol: 'AERO', tokenDecimals: 18, apyPercentage: '38.00', tvlAmount: '890000.00', minimumStake: '100.00', isActive: true,
      },
    }),
  ]);

  console.log(`Created ${pools.length} staking pools`);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
