import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Treasury Assets...');

  const assets = [
    {
      symbol: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      oracleId: 'usd-coin',
    },
    {
      symbol: 'USDT',
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimals: 6,
      oracleId: 'tether',
    },
    {
      symbol: 'stETH',
      address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
      decimals: 18,
      oracleId: 'staked-ether',
    },
  ];

  for (const asset of assets) {
    await prisma.treasuryAsset.upsert({
      where: { address: asset.address },
      update: asset,
      create: asset,
    });
    console.log(`✅ Seeded ${asset.symbol}`);
  }

  console.log('🏁 Treasury Seeding Complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
