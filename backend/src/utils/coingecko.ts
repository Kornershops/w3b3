/**
 * CoinGecko Asset Mapping
 * Links internal W3B3 Token Symbols to verified CoinGecko IDs.
 * This ensures the charts are 100% authentic.
 */
export const COINGECKO_MAP: Record<string, string> = {
  // BTC Titans
  'WBTC': 'wrapped-bitcoin',
  'cbBTC': 'coinbase-wrapped-btc',
  'tBTC': 'tbtc',

  // ETH & LSTs
  'stETH': 'staked-ether',
  'rETH': 'rocket-pool-eth',
  'swETH': 'swell-network-liquid-staking-eth',
  'cbETH': 'coinbase-wrapped-staked-eth',
  'eETH': 'ether-fi-staked-eth',
  'ezETH': 'renzo-restaked-eth',
  'pufETH': 'puffer-staked-eth',

  // SOL & Graduates
  'SOL': 'solana',
  'JitoSOL': 'jito-staked-sol',
  'mSOL': 'marinade-staked-sol',
  'bSOL': 'solblaze-staked-sol',
  'JUP': 'jupiter-exchange-solana',
  'PYTH': 'pyth-network',
  'WIF': 'dogwifhat',
  'BONK': 'bonk',
  'POPCAT': 'popcat',

  // Stables & Others
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'sUSDe': 'ethena-staked-usde',
  'sDAI': 'spark-protocol-eth',
  'PYUSD': 'paypal-usd',
  'GXO': 'gho',
  'LUSD': 'liquity-usd',
  'LINK': 'chainlink',
  'AAVE': 'aave',
  'UNI': 'uniswap',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'AVAX': 'avalanche-2',
  'DOT': 'polkadot',
  'NEAR': 'near',
  'LDO': 'lido-dao'
};

export const getCoinGeckoId = (symbol: string): string | undefined => {
  return COINGECKO_MAP[symbol];
};
