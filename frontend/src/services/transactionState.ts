import { ethers } from 'ethers';
import type { TransactionStatus } from '../types';

export interface TransactionLifecycleResult {
  status: TransactionStatus;
  receipt?: ethers.TransactionReceipt;
}

/**
 * Classifies wallet submission failures without treating arbitrary provider
 * errors as user rejection.
 */
export function classifySubmissionError(error: unknown): TransactionStatus {
  if (isUserRejectedTransaction(error)) {
    return 'rejected';
  }

  return 'failed';
}

export function isUserRejectedTransaction(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const candidate = error as { code?: unknown; message?: unknown };
  if (candidate.code === 4001 || candidate.code === 'ACTION_REJECTED') {
    return true;
  }

  return typeof candidate.message === 'string' && /user (rejected|denied)|rejected the request/i.test(candidate.message);
}

/**
 * Resolves an on-chain transaction into a deterministic application status.
 * A timeout is explicitly represented as stale rather than failed because the
 * chain has not established a terminal result yet.
 */
export async function waitForTransactionLifecycle(
  provider: ethers.Provider,
  transactionHash: string,
  timeoutMs = 120_000,
): Promise<TransactionLifecycleResult> {
  const receipt = await waitForReceiptWithTimeout(provider, transactionHash, timeoutMs);

  if (!receipt) {
    return { status: 'stale' };
  }

  return {
    status: receipt.status === 1 ? 'confirmed' : 'failed',
    receipt,
  };
}

async function waitForReceiptWithTimeout(
  provider: ethers.Provider,
  transactionHash: string,
  timeoutMs: number,
): Promise<ethers.TransactionReceipt | null> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('timeoutMs must be a positive finite number');
  }

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      provider.waitForTransaction(transactionHash),
      new Promise<null>((resolve) => {
        timeoutHandle = setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}
