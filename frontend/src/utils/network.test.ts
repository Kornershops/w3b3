import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBaseUrl } from './network';

describe('Frontend Networking Guardrails', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://w3b3.onrender.com');
  });

  it('SHOULD ensure the /api suffix is present for API calls', () => {
    const url = getBaseUrl('api');
    expect(url).toBe('https://w3b3.onrender.com/api');
  });

  it('SHOULD NOT duplicate the /api suffix if it is already present', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://w3b3.onrender.com/api');
    const url = getBaseUrl('api');
    expect(url).toBe('https://w3b3.onrender.com/api');
  });

  it('SHOULD remove trailing slashes for clean socket URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://w3b3.onrender.com/');
    const url = getBaseUrl('socket');
    expect(url).toBe('https://w3b3.onrender.com');
  });

  it('SHOULD fallback to localhost correctly if no env is set', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    const url = getBaseUrl('api');
    expect(url).toBe('http://localhost:3001/api');
  });
});
