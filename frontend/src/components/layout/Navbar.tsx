'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Pulse, SquaresFour, Compass } from '@phosphor-icons/react';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Pulse },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/portfolio', label: 'Portfolio', icon: SquaresFour },
    { href: '/leaderboard', label: 'Leaderboard', icon: Pulse }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel">
      <div className="container-max flex h-16 items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 flex items-center justify-center text-white font-bold text-lg leading-none">
              W
            </div>
            <span className="font-bold text-xl tracking-wide text-white group-hover:text-indigo-400 transition-colors">
              W3B3
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'bg-indigo-600/20 text-indigo-400 shadow-inner border border-indigo-500/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ConnectButton 
            chainStatus="icon" 
            showBalance={{ smallScreen: false, largeScreen: true }} 
          />
        </div>
      </div>
    </nav>
  );
}
