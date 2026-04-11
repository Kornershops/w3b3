'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, sepolia],
  [publicProvider()]
);

// Magic Connector Configuration for Frictionless UX
const magicConnector = new MagicConnectConnector({
  chains,
  options: {
    apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY || 'pk_live_D66F4A83675F7972',
    magicSdkConfiguration: {
      network: {
        rpcUrl: 'https://rpc.sepolia.org',
        chainId: 11155111,
      },
    },
  },
});

const magicWallet = () => ({
  id: 'magic',
  name: 'Email/Social',
  iconUrl: 'https://dashboard.magic.link/favicon.ico',
  iconBackground: '#fff',
  description: 'Log in with your email or social account',
  createConnector: () => ({
    connector: magicConnector as any,
  }),
});

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      magicWallet(),
      injectedWallet({ chains }),
      metaMaskWallet({ chains, projectId: '9a9b69123fe5cf9bd4eaf7ec87b4043b' }),
      coinbaseWallet({ chains, appName: 'W3B3 Staking Portal' }),
      walletConnectWallet({ chains, projectId: '9a9b69123fe5cf9bd4eaf7ec87b4043b' }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectors as any,
  publicClient,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
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
    </WagmiConfig>
  );
}
// build stabilization ping
