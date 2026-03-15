import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'W3B3 - Multi-Chain Staking & Yield Portal',
  description: 'Discover, assess, and stake on verified opportunities across multiple blockchains',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
