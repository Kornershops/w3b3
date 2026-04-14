'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { WagmiProvider, http, createConfig } from 'wagmi';
import * as MagicLinkModule from '@magiclabs/wagmi-connector';
import '@rainbow-me/rainbowkit/styles.css';

// Robust resolver for the Magic Link connector (Handles multiple v2 deployment variants)
const getMagicConnector = (config: any) => {
  // Prerendering Fix: Magic SDK requires localStorage which is missing on the server
  if (typeof window === 'undefined') return null;

  const lib = MagicLinkModule as any;
  const Connector = lib.magicConnector || lib.MagicConnector || lib.dedicatedWalletConnector || lib.default;
  
  if (typeof Connector !== 'function') {
    console.warn('⚠️ Magic Link connector could not be resolved. Falling back to null.');
    return null;
  }

  try {
    // Try as a factory function first (standard Wagmi v2 pattern)
    return Connector(config);
  } catch (e) {
    try {
      // Fallback to class constructor if factory fails
      return new (Connector as any)(config);
    } catch (err) {
      console.error('❌ Failed to instantiate Magic Link connector:', err);
      return null;
    }
  }
};

const queryClient = new QueryClient();

// Wagmi v2 Config Structure
const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    getMagicConnector({
      apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY || 'pk_live_D66F4A83675F7972',
      magicSdkConfiguration: {
        network: {
          rpcUrl: 'https://rpc.sepolia.org',
          chainId: 11155111,
        },
      },
    }),
  ].filter(Boolean) as any[],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#6366f1',
            accentColorForeground: 'white',
            borderRadius: 'large',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
// build stabilization ping
