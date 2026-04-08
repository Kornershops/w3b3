import { web3Service } from './web3';
import { aaService } from './aaService';
import { ethers } from 'ethers';

/**
 * Governance Service
 * Manages protocol voting power and community gauges.
 * Power is derived mathematically from staked balances.
 */
class GovernanceService {
  private votingPower: string = "0";

  /**
   * Calculate the user's total voting power across all W3B3 staking pools.
   */
  async refreshVotingPower(userAddress: string, poolAddresses: string[]) {
    let totalPower = BigInt(0);

    for (const pool of poolAddresses) {
      try {
        const balance = await web3Service.getTokenBalance(pool, userAddress);
        totalPower += BigInt(balance);
      } catch (err) {
        console.error(`Failed to fetch voting power from pool ${pool}:`, err);
      }
    }

    this.votingPower = ethers.formatEther(totalPower);
    return this.votingPower;
  }

  /**
   * Submit a community vote to a specific yield gauge.
   * This directs the RevenueRouter's next harvest allocation.
   */
  async castVote(gaugeAddress: string, weightPercentage: number) {
    console.log(`Casting vote to gauge ${gaugeAddress} with weight ${weightPercentage}%`);

    const abi = ['function vote(address gauge, uint256 weight)'];
    const iface = new ethers.Interface(abi);
    const data = iface.encodeFunctionData('vote', [gaugeAddress, weightPercentage]);

    // Use Account Abstraction for frictionless, gasless voting
    if (aaService.isInitialized()) {
      return await aaService.sendTransaction(
        gaugeAddress as `0x${string}`,
        data as `0x${string}`
      );
    }

    // Fallback to standard EOA if AA is not enabled
    const signer = web3Service.getSigner();
    if (!signer) throw new Error("Wallet not connected");

    const contract = new ethers.Contract(gaugeAddress, abi, signer);
    const tx = await contract.vote(gaugeAddress, weightPercentage);
    return await tx.wait();
  }

  getVotingPower() {
    return this.votingPower;
  }
}

export const governanceService = new GovernanceService();
