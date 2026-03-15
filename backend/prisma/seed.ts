import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample staking pools
  const pools = await Promise.all([
    prisma.stakingPool.create({
      data: {
        name: 'USDC Staking',
        chainId: 1,
        contractAddress: '0x1234567890123456789012345678901234567890',
        tokenSymbol: 'USDC',
        tokenDecimals: 6,
        apyPercentage: '12.50',
        tvlAmount: '2300000.00000000',
        minimumStake: '100.00000000',
        isActive: true,
      },
    }),
    prisma.stakingPool.create({
      data: {
        name: 'MATIC Staking',
        chainId: 137,
        contractAddress: '0x0987654321098765432109876543210987654321',
        tokenSymbol: 'MATIC',
        tokenDecimals: 18,
        apyPercentage: '8.20',
        tvlAmount: '5100000.00000000',
        minimumStake: '1000.00000000',
        isActive: true,
      },
    }),
    prisma.stakingPool.create({
      data: {
        name: 'ETH Staking',
        chainId: 1,
        contractAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        tokenSymbol: 'ETH',
        tokenDecimals: 18,
        apyPercentage: '5.75',
        tvlAmount: '8500000.00000000',
        minimumStake: '0.10000000',
        isActive: true,
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
