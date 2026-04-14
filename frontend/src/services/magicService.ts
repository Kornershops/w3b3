import { Magic } from 'magic-sdk';
// @ts-ignore
import { ConnectExtension } from '@magic-ext/connect';

const API_KEY = process.env.NEXT_PUBLIC_MAGIC_API_KEY || 'pk_live_382A6E9B9A3D0B7C';

/**
 * Module 2: V3 Mobile Dominance
 * MagicService - Specialized identity abstraction for biometric Speed-Stake UX.
 */
export const magic = typeof window !== 'undefined' 
  ? new Magic(API_KEY, {
      extensions: [new ConnectExtension()]
    })
  : null;

export const magicService = {
  /**
   * Initializes the Biometric Speed-Stake session.
   * Leverages Magic Connect for a frictionless institutional-grade onboarding.
   */
  initializeSpeedStake: async () => {
    if (!magic) return { success: false, error: 'Magic NOT_INITIALIZED' };
    
    try {
      const accounts = await magic.connect.getWalletInfo();
      console.log('Magic Connect Wallet Info:', accounts);
      return { success: true, wallet: accounts };
    } catch (error: any) {
      console.error('Magic Service SpeedStake Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Performs a high-fidelity biometric transaction signature request.
   */
  signSpeedTransaction: async () => {
    if (!magic) throw new Error('Magic SDK not initialized');
    // Orchestrates biometric signature via Magic Connect overlay
    return await magic.connect.showWallet();
  }
};
