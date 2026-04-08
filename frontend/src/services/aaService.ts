import { createLightAccount, LightSmartContractAccount } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Chain, HttpTransport } from "viem";
import { sepolia } from "viem/chains";

/**
 * Account Abstraction Service
 * Manages the lifecycle of ERC-4337 Smart Accounts.
 */
class AAService {
  private provider: AlchemyProvider | null = null;
  private account: LightSmartContractAccount | null = null;

  /**
   * Initialize a Smart Account from an existing EOA Signer (e.g., Magic or MetaMask)
   */
  async initializeAccount(signer: any) {
    const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'your-alchemy-api-key';
    const policyId = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID; // Optional: for gasless

    // Create the Alchemy Provider
    this.provider = new AlchemyProvider({
      apiKey,
      chain: sepolia as Chain,
    });

    // We start with a Light Account (Standard for W3B3)
    this.provider.connect((rpcClient) =>
      createLightAccount({
        chain: sepolia,
        transport: rpcClient,
        signer,
      })
    );

    // If we have a Policy ID, enable gas sponsorship
    if (policyId) {
      this.provider.withAlchemyGasManager({
        policyId,
      });
    }

    this.account = this.provider.getAccount() as LightSmartContractAccount;
    return this.account.getAddress();
  }

  /**
   * Send a sponsored (or user-paid) transaction via the Bundler
   */
  async sendTransaction(target: `0x${string}`, data: `0x${string}`, value: bigint = BigInt(0)) {
    if (!this.provider) throw new Error("AA Provider not initialized");

    const { hash } = await this.provider.sendUserOperation({
      target,
      data,
      value,
    });

    return await this.provider.waitForUserOperationTransaction(hash);
  }

  getAddress(): string {
    return this.account?.getAddress() || '0x0';
  }

  isInitialized(): boolean {
    return !!this.account;
  }
}

export const aaService = new AAService();
