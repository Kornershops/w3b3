import { LightAccount } from "@alchemy/aa-accounts";
import { createLightAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";

/**
 * Account Abstraction Service
 * Manages the lifecycle of ERC-4337 Smart Accounts.
 */
class AAService {
  private client: any = null;
  private account: LightAccount | null = null;

  /**
   * Initialize a Smart Account from an existing EOA Signer (e.g., Magic or MetaMask)
   */
  async initializeAccount(signer: any) {
    const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'your-alchemy-api-key';
    const policyId = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;

    // Create the Alchemy Light Account Client (v3 Pattern)
    this.client = await createLightAccountAlchemyClient({
      apiKey,
      chain: sepolia as any,
      signer,
      gasManagerConfig: policyId ? { policyId } : undefined,
    });

    this.account = this.client.account;
    return this.account?.address || '0x0';
  }

  /**
   * Send a sponsored (or user-paid) transaction via the Bundler
   */
  async sendTransaction(target: `0x${string}`, data: `0x${string}`, value: bigint = BigInt(0)) {
    if (!this.client) throw new Error("AA Client not initialized");

    const result = await this.client.sendUserOperation({
      uo: {
        target,
        data,
        value,
      },
    });

    return await this.client.waitForUserOperationTransaction(result);
  }

  getAddress(): string {
    return this.account?.address || '0x0';
  }

  isInitialized(): boolean {
    return !!this.account;
  }
}

export const aaService = new AAService();
// Deployment Sync Marker: 1775690626
