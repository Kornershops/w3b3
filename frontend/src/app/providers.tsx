'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
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
import { WagmiProvider, http } from 'wagmi';
import { magicConnector } from '@magiclabs/wagmi-connector';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'W3B3 Staking Portal',
  projectId: '9a9b69123fe5cf9bd4eaf7ec87b4043b',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
  connectors: [
    magicConnector({
      apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY || 'pk_live_D66F4A83675F7972',
      magicSdkConfiguration: {
        network: {
          rpcUrl: 'https://rpc.sepolia.org',
          chainId: 11155111,
        },
      },
    }),
  ],
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
