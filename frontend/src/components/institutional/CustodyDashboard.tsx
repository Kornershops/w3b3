import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Plus, 
  Gear, 
  CheckCircle, 
  XCircle,
  Link as LinkIcon,
  Pulse
} from '@phosphor-icons/react';
import { apiService } from '@/services/api';
import { useAccount } from 'wagmi';

export function CustodyDashboard() {
  const { address } = useAccount();
  const [vaults, setVaults] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsLinking] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const userVaults = await apiService.getMyVaults();
      setVaults(userVaults);
      
      // Flatten proposals from all vaults
      const allProposals = userVaults.flatMap((v: any) => 
        v.proposals.map((p: any) => ({ ...p, vaultName: v.name }))
      );
      setProposals(allProposals.filter((p: any) => p.status === 'PENDING'));
    } catch (err) {
      console.error('Failed to load institutional data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (proposalId: string) => {
    if (!address) return alert('Please connect signer wallet');
    try {
      await apiService.approveProposal(proposalId, address);
      loadData(); // Refresh
    } catch (err) {
      console.error('Approval failed', err);
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Pulse size={32} className="text-indigo-400 animate-pulse" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Institutional Custody</h1>
          <p className="text-slate-500 text-sm font-medium">Manage multi-sig approvals and Gnosis Safe integrations.</p>
        </div>
        <button 
          onClick={() => setIsLinking(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={16} weight="bold" />
          <span>Link External Vault</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Vaults Section */}
        <div className="lg:col-span-12">
          <div className="glass-card bg-indigo-900/5 hover:border-indigo-500/30">
            <div className="flex items-center gap-2 mb-6">
               <ShieldCheck size={20} className="text-indigo-400" weight="fill" />
               <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Multi-Sig Vaults</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaults.map(vault => (
                <div key={vault.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Gear size={24} className="animate-spin-slow" />
                  </div>
                  <h3 className="font-black text-white text-lg tracking-tighter mb-1">{vault.name}</h3>
                  <code className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded font-mono break-all">{vault.address}</code>
                  
                  <div className="mt-6 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-slate-500" />
                        <span className="text-xs text-slate-400 font-bold">{vault.threshold}/{vault.signers.length} REQUIRED</span>
                      </div>
                      <span className="text-[10px] font-black text-green-400 uppercase bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 tracking-tighter">
                        ACTIVE
                      </span>
                  </div>
                </div>
              ))}
              {vaults.length === 0 && <p className="text-xs text-slate-500 italic p-4">No institutional vaults detected. Create one to begin.</p>}
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="lg:col-span-8">
          <div className="glass-card h-full">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <FileText size={20} className="text-amber-400" weight="bold" />
                 <h2 className="text-sm font-black text-white uppercase tracking-widest">Pending Proposals</h2>
               </div>
               <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-black">ACTION REQUIRED</span>
            </div>

            <div className="space-y-3">
              {proposals.map(prop => (
                <div key={prop.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                   <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-white uppercase tracking-tighter">PROPOSAL #{prop.id.slice(0,4)}</span>
                        <span className="text-slate-500 text-[10px]">VAULT: {prop.vaultName}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-400 truncate max-w-[200px]">{prop.metadata || 'Asset Rebalance Action'}</p>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <div className="text-right mr-2 hidden sm:block">
                        <p className="text-[10px] text-slate-500 font-black">APPROVALS</p>
                        <p className="text-xs font-black text-white">{prop.currentConfirmations}/{prop.requiredConfirmations}</p>
                      </div>
                      <button 
                        onClick={() => handleApprove(prop.id)}
                        className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl hover:bg-green-500/20 transition-all pointer-events-auto z-10"
                      >
                        <CheckCircle size={20} weight="fill" />
                      </button>
                      <button className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
                        <XCircle size={20} weight="fill" />
                      </button>
                   </div>
                </div>
              ))}
              {proposals.length === 0 && <p className="text-xs text-slate-500 italic p-4">All proposals cleared. No pending actions.</p>}
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="lg:col-span-4">
          <div className="glass-card bg-indigo-500/5 border-indigo-500/20 h-full">
            <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4">KYB Status</h2>
            <div className="aspect-square w-full rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center">
               <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                 <LinkIcon size={32} className="text-slate-600" />
               </div>
               <p className="text-sm font-black text-white mb-2 italic">Entity Verification</p>
               <p className="text-xs text-slate-500 leading-relaxed mb-6">Complete your Institutional Entity profile to unlock higher credit limits.</p>
               <button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all">
                 Verify Business
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
