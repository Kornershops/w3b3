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
import { WagmiProvider, http, createConfig, createStorage, noopStorage } from 'wagmi';
import * as MagicLinkModule from '@magiclabs/wagmi-connector';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

// 1. Build-Safe Config Factory
const getWagmiConfig = () => {
    // During SSR/Build, we return a minimal config to avoid triggering localStorage side effects
    const isServer = typeof window === 'undefined';

    const getMagicConnector = (config: any) => {
      if (isServer) return null; // CRITICAL: Stop Magic SDK from loading on Render build server
      
      const lib = MagicLinkModule as any;
      const Connector = lib.magicConnector || lib.MagicConnector || lib.dedicatedWalletConnector || lib.default;
      
      if (typeof Connector !== 'function') return null;

      try {
        return Connector(config);
      } catch (e) {
        try {
          return new (Connector as any)(config);
        } catch (err) {
          return null;
        }
      }
    };

    return createConfig({
      chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
      ssr: true, // Enable Wagmi SSR mode
      transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
        [sepolia.id]: http(),
      },
      storage: isServer ? createStorage({ storage: noopStorage }) : undefined,
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
};

// Singleton config to preserve state across client re-renders
let clientConfig: any = null;

export function Providers({ children }: { children: React.ReactNode }) {
  // Use a ref to ensure the config remains stable after first mount
  const config = React.useMemo(() => {
    if (typeof window === 'undefined') return getWagmiConfig();
    if (!clientConfig) clientConfig = getWagmiConfig();
    return clientConfig;
  }, []);

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
