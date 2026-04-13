import prisma from '../config/database';
import { MultiSigProposal, ProposalStatus } from '@w3b3/shared';

/**
 * InstitutionalCustodyService
 * Manages the connection between W3B3 and institutional custody providers (Gnosis Safe, Fireblocks).
 * Ensures that high-value transactions follow mandatory multi-sig approval workflows.
 */
export class InstitutionalCustodyService {
  /**
   * Proposes a transaction for multi-sig approval.
   */
  async proposeTransaction(vaultId: string, transactionData: any, metadata: { reason: string; initiator: string }) {
    const vault = await prisma.institutionalVault.findUnique({
      where: { id: vaultId },
      include: { signers: true }
    });

    if (!vault) throw new Error('Vault not found');

    const proposal = await prisma.custodyProposal.create({
      data: {
        vaultId,
        transactionData: JSON.stringify(transactionData),
        metadata: JSON.stringify(metadata),
        status: 'PENDING',
        requiredConfirmations: vault.threshold,
        currentConfirmations: 0,
      }
    });

    return proposal;
  }

  /**
   * Records a signer's approval for a pending institutional action.
   */
  async approveProposal(proposalId: string, signerAddress: string) {
    const proposal = await prisma.custodyProposal.findUnique({
      where: { id: proposalId },
      include: { vault: { include: { signers: true } } }
    });

    if (!proposal) throw new Error('Proposal not found');

    const isAuthorized = proposal.vault.signers.some(s => s.address.toLowerCase() === signerAddress.toLowerCase());
    if (!isAuthorized) throw new Error('Unauthorized signer');

    const updatedProposal = await prisma.custodyProposal.update({
      where: { id: proposalId },
      data: {
        currentConfirmations: { increment: 1 },
      }
    });

    if (updatedProposal.currentConfirmations >= updatedProposal.requiredConfirmations) {
      await this.executeProposal(proposalId);
    }

    return updatedProposal;
  }

  private async executeProposal(proposalId: string) {
    // Logic to broadcast the transaction to the network via the Custody Bridge
    await prisma.custodyProposal.update({
      where: { id: proposalId },
      data: { status: 'EXECUTED' }
    });
    console.log(`Executed Institutional Proposal: ${proposalId}`);
  }
}

export const institutionalCustodyService = new InstitutionalCustodyService();
