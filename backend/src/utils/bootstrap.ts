import { PrismaClient } from '@prisma/client';

export async function seed(client: PrismaClient) {
  console.log('Seeding database with the W3B3 "Alpha 20" Global Set...');

  const pools = await Promise.all([
    // --- ETHEREUM & L2 TITANS ---
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' } },
      update: { isActive: true },
      create: { name: 'Lido staked ETH', chainId: 1, contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', tokenSymbol: 'stETH', tokenDecimals: 18, apyPercentage: '4.2', tvlAmount: '24100500.00', minimumStake: '0.1', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0xae78736cd615f374d3085123a210448e74fc6393' } },
      update: { isActive: true },
      create: { name: 'Rocket Pool ETH', chainId: 1, contractAddress: '0xae78736cd615f374d3085123a210448e74fc6393', tokenSymbol: 'rETH', tokenDecimals: 18, apyPercentage: '3.8', tvlAmount: '12050000.00', minimumStake: '0.1', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0xbe9895146f7af43049ca1c1ae358b054457ee5f0' } },
      update: { isActive: true },
      create: { name: 'Ether.fi Restaked ETH', chainId: 1, contractAddress: '0xbe9895146f7af43049ca1c1ae358b054457ee5f0', tokenSymbol: 'eETH', tokenDecimals: 18, apyPercentage: '18.5', tvlAmount: '8400000.00', minimumStake: '0.1', isActive: true },
    }),

    // --- BTC WRAPPED & LSTs ---
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' } },
      update: { isActive: true },
      create: { name: 'Wrapped BTC (Alpha)', chainId: 1, contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', tokenSymbol: 'WBTC', tokenDecimals: 8, apyPercentage: '2.1', tvlAmount: '45000000.00', minimumStake: '0.01', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 8453, contractAddress: '0xcbB7C91535798949f425b097b0a7587849137456' } },
      update: { isActive: true },
      create: { name: 'Coinbase BTC (Base)', chainId: 8453, contractAddress: '0xcbB7C91535798949f425b097b0a7587849137456', tokenSymbol: 'cbBTC', tokenDecimals: 8, apyPercentage: '3.4', tvlAmount: '12000000.00', minimumStake: '0.01', isActive: true },
    }),

    // --- SOLANA BLUE-CHIPS (RAYDIUM GRADUATES) ---
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 101, contractAddress: 'J1tLqX8bR1syN_Jito' } },
      update: { isActive: true },
      create: { name: 'Jito Liquid Staking', chainId: 101, contractAddress: 'J1tLqX8bR1syN_Jito', tokenSymbol: 'JitoSOL', tokenDecimals: 9, apyPercentage: '8.4', tvlAmount: '98000000.00', minimumStake: '1', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 101, contractAddress: 'WIF_GRADUATE_TOKEN' } },
      update: { isActive: true },
      create: { name: 'Dogwifhat Alpha (Grad)', chainId: 101, contractAddress: 'WIF_GRADUATE_TOKEN', tokenSymbol: 'WIF', tokenDecimals: 6, apyPercentage: '14.2', tvlAmount: '5400000.00', minimumStake: '100', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 101, contractAddress: 'JUP_GOVERNANCE' } },
      update: { isActive: true },
      create: { name: 'Jupiter Aggregator', chainId: 101, contractAddress: 'JUP_GOVERNANCE', tokenSymbol: 'JUP', tokenDecimals: 6, apyPercentage: '11.8', tvlAmount: '21000000.00', minimumStake: '10', isActive: true },
    }),

    // --- STABLE & INSTITUTIONAL ---
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0x4e65fE4DbA92790696d040bd123f5454668DacD2' } },
      update: { isActive: true },
      create: { name: 'Ethena sUSDe', chainId: 1, contractAddress: '0x4e65fE4DbA92790696d040bd123f5454668DacD2', tokenSymbol: 'sUSDe', tokenDecimals: 18, apyPercentage: '16.5', tvlAmount: '4200000.00', minimumStake: '500', isActive: true },
    }),
    // --- REMAINING ALPHA 20 ---
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 101, contractAddress: 'BONK_GRADUATE' } },
      update: { isActive: true },
      create: { name: 'Bonk Rewards (Grad)', chainId: 101, contractAddress: 'BONK_GRADUATE', tokenSymbol: 'BONK', tokenDecimals: 5, apyPercentage: '19.4', tvlAmount: '3200000.00', minimumStake: '1000000', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0x35e252e247265be004414909166946ce78ca490c' } },
      update: { isActive: true },
      create: { name: 'Swell Liquid Stake', chainId: 1, contractAddress: '0x35e252e247265be004414909166946ce78ca490c', tokenSymbol: 'swETH', tokenDecimals: 18, apyPercentage: '4.8', tvlAmount: '2100000.00', minimumStake: '0.1', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 42161, contractAddress: '0xfc5A1A6EB076a9C7210d2109e2CE07E780E25c07' } },
      update: { isActive: true },
      create: { name: 'GMX Master (Arb)', chainId: 42161, contractAddress: '0xfc5A1A6EB076a9C7210d2109e2CE07E780E25c07', tokenSymbol: 'GMX', tokenDecimals: 18, apyPercentage: '14.5', tvlAmount: '4500000.00', minimumStake: '1', isActive: true },
    }),
  ]);

  console.log(`Successfully bootstrapped ${pools.length} global-scale staking pools`);

  // --- FINAL 15 INSTITUTIONAL BEDROCKS ---
  await Promise.all([
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0x5f98805a463973343268781da817940fd03847aa' } },
      update: { isActive: true },
      create: { name: 'Liquity LUSD (Stable)', chainId: 1, contractAddress: '0x5f98805a463973343268781da817940fd03847aa', tokenSymbol: 'LUSD', tokenDecimals: 18, apyPercentage: '9.2', tvlAmount: '18000000.00', minimumStake: '100', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0x40d16fc02446e10012918ad5feaec479ec7fcf52' } },
      update: { isActive: true },
      create: { name: 'Aave GHO (Stable)', chainId: 1, contractAddress: '0x40d16fc02446e10012918ad5feaec479ec7fcf52', tokenSymbol: 'GHO', tokenDecimals: 18, apyPercentage: '10.5', tvlAmount: '24000000.00', minimumStake: '100', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0xf97f4df70ada79d912563504107127cae4708a0b' } },
      update: { isActive: true },
      create: { name: 'Chainlink Infrastructure', chainId: 1, contractAddress: '0xf97f4df70ada79d912563504107127cae4708a0b', tokenSymbol: 'LINK', tokenDecimals: 18, apyPercentage: '6.4', tvlAmount: '150000000.00', minimumStake: '10', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 1, contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca' } },
      update: { isActive: true },
      create: { name: 'Uniswap Governance', chainId: 1, contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca', tokenSymbol: 'UNI', tokenDecimals: 18, apyPercentage: '5.2', tvlAmount: '85000000.00', minimumStake: '10', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 42161, contractAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548' } },
      update: { isActive: true },
      create: { name: 'Arbitrum Foundation', chainId: 42161, contractAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548', tokenSymbol: 'ARB', tokenDecimals: 18, apyPercentage: '7.8', tvlAmount: '1200000000.00', minimumStake: '50', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 10, contractAddress: '0x4200000000000000000000000000000000000042' } },
      update: { isActive: true },
      create: { name: 'Optimism Mainnet', chainId: 10, contractAddress: '0x4200000000000000000000000000000000000042', tokenSymbol: 'OP', tokenDecimals: 18, apyPercentage: '11.2', tvlAmount: '950000000.00', minimumStake: '20', isActive: true },
    }),
    client.stakingPool.upsert({
      where: { chainId_contractAddress: { chainId: 101, contractAddress: 'NATIVE_SOL_LOCK' } },
      update: { isActive: true },
      create: { name: 'Solana Native Staking', chainId: 101, contractAddress: 'NATIVE_SOL_LOCK', tokenSymbol: 'SOL', tokenDecimals: 9, apyPercentage: '7.1', tvlAmount: '450000000.00', minimumStake: '1', isActive: true },
    }),
  ]);

  console.log(`Successfully bootstrapped ${pools.length} Platinum-scale staking pools`);

  // Bootstrapping Treasury Assets (Fixed Registry)
  await Promise.all([
    client.treasuryAsset.upsert({
      where: { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
      update: { symbol: 'USDC', decimals: 6 },
      create: { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
    }),
    client.treasuryAsset.upsert({
      where: { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
      update: { symbol: 'WBTC', decimals: 8 },
      create: { symbol: 'WBTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', decimals: 8 },
    }),
  ]);
}
