import axios from 'axios';
import config from '../config/env';
import logger from '../utils/logger';

/**
 * Module 3: App-Chain Readiness
 * GasService - Orchestrates gasless transactions (Sponsored UserOps) using Alchemy Paymaster.
 */
export class GasService {
  private alchemyUrl: string;

  constructor() {
    this.alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${config.web3.alchemyApiKey}`;
  }

  /**
   * Requests a paymaster sponsorship signature for a given ERC-4337 UserOperation.
   * Enables institutional signers to execute transactions without native gas holdings.
   */
  async sponsorUserOperation(userOp: any, chainId: number) {
    try {
      logger.info(`GasService: Initiating gas sponsorship request on Chain [${chainId}]`);
      
      const response = await axios.post(this.alchemyUrl, {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_requestPaymasterAndData',
        params: [
          {
            policyId: process.env.ALCHEMY_GAS_POLICY_ID || 'PROT-STABILITY-V3',
            entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // Standard v0.6 EntryPoint
            userOperation: userOp
          }
        ]
      });

      if (response.data.error) {
        throw new Error(`Alchemy Paymaster Error: ${response.data.error.message}`);
      }

      logger.info('GasService: Sponsorship signature successfully generated.');
      return response.data.result;
    } catch (error: any) {
      logger.error('GasService Sponsorship Failure:', error.message);
      // Fallback: indicate that sponsorship is unavailable
      return null;
    }
  }
}

export const gasService = new GasService();
