'use client';

import React from 'react';
import { CustodyDashboard } from '@/components/institutional/CustodyDashboard';

/**
 * Institutional Suite Page
 * Central hub for Enterprise-grade features including Multi-Sig Custody and KYB.
 */
export default function InstitutionalPage() {
  return (
    <div className="container-max py-12 px-4">
      <CustodyDashboard />
    </div>
  );
}
