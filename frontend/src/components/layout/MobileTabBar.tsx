'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  House, 
  RocketLaunch, 
  SquaresFour, 
  Lightning, 
  Wallet,
  ShieldCheck
} from '@phosphor-icons/react';

const mobileLinks = [
  { href: '/', label: 'Home', icon: House },
  { href: '/factory', label: 'Build', icon: RocketLaunch },
  { href: '/portfolio', label: 'Wallet', icon: Wallet },
  { href: '/recursive', label: 'Alpha', icon: Lightning },
  { href: '/institutional', label: 'Safe', icon: ShieldCheck }
];

/**
 * MobileTabBar
 * A premium, glassmorphic bottom navigation bar optimized for high-end mobile devices.
 * Features micro-animations and phosphor icons for a matured institutional feel.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[400px]">
      <div className="flex items-center justify-around p-2 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href} className="relative py-2 px-4 flex flex-col items-center gap-1">
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-[18px]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon 
                size={24} 
                weight={isActive ? 'fill' : 'regular'} 
                className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} 
              />
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
