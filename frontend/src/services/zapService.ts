import { web3Service } from './web3';
import { aaService } from './aaService';
import { ethers } from 'ethers';

/**
 * Zap Service
 * Orchestrates multi-step transactions (Swap + Stake / Bridge + Stake)
 * into a single "Zap" interaction.
 */
class ZapService {
  /**
   * Performs a "Zap" staking operation.
   * In a full implementation, this would interact with a DEX aggregator (1inch/Paraswap)
   * to swap an input token for the stake-able asset and then stake it.
   */
  async zapIn(
    poolAddress: string,
    inputTokenAddress: string,
    amount: string,
    abi: any
  ) {
    console.log(`Starting Zap: ${amount} from ${inputTokenAddress} into pool ${poolAddress}`);

    // Check if we are using Account Abstraction (Frictionless mode)
    if (aaService.isInitialized()) {
      return this.executeSmartZap(poolAddress, amount, abi);
    }

    // Fallback: Proceed with a standard multi-step EOA transaction
    // Step 1: Approve
    await web3Service.approveToken(inputTokenAddress, poolAddress, amount);
    
    // Step 2: Stake
    return await web3Service.stakeTokens(poolAddress, amount, abi);
  }

  /**
   * Frictionless Smart Zap using ERC-4337
   * Note: This can be expanded to bundle multiple operations into a SINGLE UserOperation
   * effectively removing "Approval" as a separate user step.
   */
  private async executeSmartZap(poolAddress: string, amount: string, abi: any) {
    const iface = new ethers.Interface(abi);
    const data = iface.encodeFunctionData('stake', [ethers.parseEther(amount)]);
    
    // In a smart account, we could bundle the 'approve' and 'stake' operations here
    // for true 1-transaction zapping.
    return await aaService.sendTransaction(
      poolAddress as `0x${string}`,
      data as `0x${string}`
    );
  }
}

export const zapService = new ZapService();
