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
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
      <div className="container-max flex h-16 items-center justify-between px-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-black text-sm leading-none italic">
              W3
            </div>
            <span className="hidden sm:inline font-black text-lg tracking-tighter text-white uppercase italic">
              W3B3 <span className="text-indigo-500 text-[10px] not-italic align-top">PRO</span>
            </span>
          </Link>

          {/* Desktop Nav Links - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} weight="bold" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ConnectButton 
             accountStatus="avatar"
             chainStatus="icon" 
             showBalance={{ smallScreen: false, largeScreen: true }} 
          />
        </div>
      </div>
    </nav>
  );
}
