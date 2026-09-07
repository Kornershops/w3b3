import { describe, expect, it, vi } from 'vitest';
import {
  classifySubmissionError,
  isUserRejectedTransaction,
  waitForTransactionLifecycle,
} from './transactionState';

describe('transaction lifecycle state', () => {
  it('classifies EIP-1193 user rejection as rejected', () => {
    expect(classifySubmissionError({ code: 4001, message: 'User rejected the request' })).toBe('rejected');
    expect(isUserRejectedTransaction({ code: 'ACTION_REJECTED' })).toBe(true);
  });

  it('does not classify arbitrary provider failures as rejection', () => {
    expect(classifySubmissionError(new Error('RPC unavailable'))).toBe('failed');
    expect(isUserRejectedTransaction({ code: -32000, message: 'execution reverted' })).toBe(false);
  });

  it('returns confirmed for a successful receipt', async () => {
    const provider = {
      waitForTransaction: vi.fn().mockResolvedValue({ status: 1 }),
    } as any;

    const result = await waitForTransactionLifecycle(provider, '0xabc', 1000);
    expect(result.status).toBe('confirmed');
    expect(result.receipt?.status).toBe(1);
  });

  it('returns failed for a reverted receipt', async () => {
    const provider = {
      waitForTransaction: vi.fn().mockResolvedValue({ status: 0 }),
    } as any;

    const result = await waitForTransactionLifecycle(provider, '0xabc', 1000);
    expect(result.status).toBe('failed');
  });

  it('returns stale when confirmation exceeds the timeout', async () => {
    const provider = {
      waitForTransaction: vi.fn().mockReturnValue(new Promise(() => undefined)),
    } as any;

    const result = await waitForTransactionLifecycle(provider, '0xabc', 5);
    expect(result.status).toBe('stale');
  });

  it('rejects invalid timeout configuration', async () => {
    const provider = { waitForTransaction: vi.fn() } as any;

    await expect(waitForTransactionLifecycle(provider, '0xabc', 0)).rejects.toThrow(
      'timeoutMs must be a positive finite number',
    );
  });
});
