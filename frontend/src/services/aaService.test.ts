import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aaService } from './aaService';

describe('Account Abstraction Identity Guardrails', () => {
  beforeEach(() => {
    // Standard mock environment
    vi.stubEnv('NEXT_PUBLIC_ALCHEMY_API_KEY', 'test-key');
  });

  it('SHOULD report uninitialized state by default', () => {
    expect(aaService.isInitialized()).toBe(false);
  });

  it('SHOULD have a default null address when uninitialized', () => {
    expect(aaService.getAddress()).toBe('0x0');
  });

  // Note: Deep initialization testing requires significant mocking of the 
  // alchemy provider internals. For this stability Tier, we focus on 
  // the service's state resilience.
});
