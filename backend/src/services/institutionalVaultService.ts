import prisma from '../config/database';
import logger from '../utils/logger';

/**
 * InstitutionalVaultService
 * Manages high-security multi-sig containers for DAO and Enterprise users.
 */
export class InstitutionalVaultService {
  /**
   * Creates a new Multi-Sig Vault with a defined threshold and signers.
   */
  async createVault(ownerId: string, data: {
    name: string;
    address: string;
    threshold: number;
    signers: Array<{ address: string; name?: string }>;
  }) {
    try {
      logger.info(`🏛️ Creating Institutional Vault: ${data.name} for Owner [${ownerId}]`);
      
      const vault = await prisma.institutionalVault.create({
        data: {
          name: data.name,
          address: data.address,
          threshold: data.threshold,
          ownerId,
          signers: {
            create: data.signers
          }
        },
        include: {
          signers: true
        }
      });

      return vault;
    } catch (error) {
      logger.error('Failed to create Institutional Vault:', error);
      throw error;
    }
  }

  /**
   * Proposes a new custody transaction (e.g., Staking Alpha Registry assets).
   */
  async proposeTransaction(vaultId: string, userId: string, proposal: {
    transactionData: string;
    metadata?: string;
    requiredConfirmations: number;
  }) {
    try {
      logger.info(`⚖️ New Custody Proposal on Vault [${vaultId}] by User [${userId}]`);
      
      return await prisma.custodyProposal.create({
        data: {
          vaultId,
          userId,
          transactionData: proposal.transactionData,
          metadata: proposal.metadata,
          requiredConfirmations: proposal.requiredConfirmations,
          status: 'PENDING'
        }
      });
    } catch (error) {
      logger.error('Failed to create Custody Proposal:', error);
      throw error;
    }
  }

  /**
   * Approves a pending proposal. If threshold is met, status becomes EXECUTED.
   */
  async approveProposal(proposalId: string, signerAddress: string) {
    try {
      // 1. Record the approval
      await prisma.proposalApproval.create({
        data: {
          proposalId,
          signerAddress
        }
      });

      // 2. Update confirmation count and check threshold
      const proposal = await prisma.custodyProposal.findUnique({
        where: { id: proposalId },
        include: { approvals: true }
      });

      if (!proposal) throw new Error('Proposal not found');

      const currentConfirmations = proposal.approvals.length;
      
      const isExecuted = currentConfirmations >= proposal.requiredConfirmations;
      
      return await prisma.custodyProposal.update({
        where: { id: proposalId },
        data: {
          currentConfirmations,
          status: isExecuted ? 'EXECUTED' : 'PENDING'
        }
      });
    } catch (error) {
       logger.error('Approval failed:', error);
       throw error;
    }
  }

  /**
   * Fetches all vaults where a specific user is a signer or the owner.
   */
  async getVaultsForUser(userId: string, walletAddress: string) {
    return await prisma.institutionalVault.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { signers: { some: { address: walletAddress } } }
        ]
      },
      include: {
        signers: true,
        proposals: {
          include: {
            approvals: true
          }
        }
      }
    });
  }
}

export const institutionalVaultService = new InstitutionalVaultService();
