import { Request, Response } from 'express';
import { institutionalVaultService } from '../services/institutionalVaultService';
import logger from '../utils/logger';

export class VaultController {
  async createVault(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const vault = await institutionalVaultService.createVault(userId, req.body);
      res.json(vault);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyVaults(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const walletAddress = (req as any).user.walletAddress;
      const vaults = await institutionalVaultService.getVaultsForUser(userId, walletAddress);
      res.json(vaults);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async propose(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { vaultId, transactionData, metadata, threshold } = req.body;
      const proposal = await institutionalVaultService.proposeTransaction(vaultId, userId, {
        transactionData,
        metadata,
        requiredConfirmations: threshold
      });
      res.json(proposal);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { proposalId, signerAddress } = req.body;
      const result = await institutionalVaultService.approveProposal(proposalId, signerAddress);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const vaultController = new VaultController();
