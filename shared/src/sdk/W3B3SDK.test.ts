import { describe, it, expect } from 'vitest';
import { W3B3SDK } from './W3B3SDK';
import { ethers } from 'ethers';

describe('W3B3SDK', () => {
  it('should throw an error if missing an API key during initialization', () => {
    expect(() => {
      new W3B3SDK({ apiKey: '', rpcUrl: 'http://localhost:8545', chainId: 1 });
    }).toThrow('W3B3 API Key is required for SDK initialization.');
  });

  it('should fetch mock opportunities correctly', async () => {
    const sdk = new W3B3SDK({ apiKey: 'test_key', rpcUrl: 'http://localhost:8545', chainId: 1 });
    const opportunities = await sdk.getTopOpportunities();
    
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0].asset).toBe('stETH');
  });

  it('should successfully mock a deposit execution', async () => {
    const sdk = new W3B3SDK({ apiKey: 'test_key', rpcUrl: 'http://localhost:8545', chainId: 1 });
    
    // Create a mock signer
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const signer = new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890123', provider);
    
    const txHash = await sdk.executeDeposit('pool-eth-01', '1.5', signer);
    
    expect(txHash).toContain('0x_sdk_tx_');
  });
});
