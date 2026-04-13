import React from 'react';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

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
    <html lang="en" className={`${outfit.variable} font-sans`}>
      <body className="bg-[#0A0B0F] text-slate-100 min-h-screen">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0B0F] to-[#0A0B0F] pb-32 md:pb-0">
              {children}
            </main>
            <MobileTabBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
