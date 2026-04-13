import { createLightAccount } from "@alchemy/aa-accounts";
import { createAlchemySmartAccountClient, AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { http, Account } from "viem";

/**
 * Account Abstraction Service
 * Manages the lifecycle of ERC-4337 Smart Accounts.
 * Upgraded to Alchemy AA SDK v3 (Compatible with Viem 2.x / Wagmi 2.x)
 */
class AAService {
  private client: AlchemySmartAccountClient | null = null;
  private account: Account | null = null;

  /**
   * Initialize a Smart Account from an existing EOA Signer (e.g., Magic or MetaMask)
   */
  async initializeAccount(signer: any) {
    const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'your-alchemy-api-key';
    const policyId = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;

    // 1. Create the Light Account Factory
    const lightAccount = await createLightAccount({
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
      chain: sepolia,
      signer: signer as any,
    });

    this.account = lightAccount;

    // 2. Create the Alchemy Smart Account Client
    this.client = createAlchemySmartAccountClient({
      apiKey,
      chain: sepolia, // Mandatory in SDK v3
      account: lightAccount,
      gasManagerConfig: policyId ? { policyId } : undefined,
    });

    return lightAccount.address;
  }

  /**
   * Send a sponsored (or user-paid) transaction via the Bundler
   */
  async sendTransaction(target: `0x${string}`, data: `0x${string}`, value: bigint = BigInt(0)) {
    if (!this.client || !this.account) throw new Error("AA Client not initialized");

    const result = await this.client.sendUserOperation({
      uo: {
        target,
        data,
        value,
      },
      account: this.client.account, // Explicitly pass the account for strict v3 typing
    });

    // In Alchemy v3, result contains the userOpHash
    return await this.client.waitForUserOperationTransaction({
      hash: result.hash,
    });
  }

  getAddress(): string {
    return this.account?.address || '0x0';
  }

  isInitialized(): boolean {
    return !!this.account;
  }
}

export const aaService = new AAService();
// Version Alignment Sync: Alchemy SDK v3.x | Viem 2.x
