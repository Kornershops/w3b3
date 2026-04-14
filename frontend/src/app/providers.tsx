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

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // Prerendering Guard: We MUST defer Wagmi config creation to the client side
  // otherwise Magic SDK or other connectors might attempt to access localStorage during build.
  const [mount, setMount] = React.useState(false);

  React.useEffect(() => {
    setMount(true);
  }, []);

  const config = React.useMemo(() => {
    if (!mount) return null;

    const getMagicConnector = (config: any) => {
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
  }, [mount]);

  // During SSR / Prerendering, we render a simplified version or nothing to avoid storage crashes
  if (!mount || !config) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

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
