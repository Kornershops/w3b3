import request from 'supertest';
import app from '../../src/index';

// Mock the services to avoid real DB calls in integration tests
jest.mock('../../src/services/poolService', () => ({
  poolService: {
    getPools: jest.fn().mockResolvedValue({
      data: [{ id: 'pool_1', name: 'Ethereum Pool', chainId: 1 }],
      pagination: { total: 1, page: 1, limit: 10, pages: 1 }
    }),
    getPoolById: jest.fn().mockResolvedValue({ id: 'pool_1', name: 'Ethereum Pool', chainId: 1 }),
  }
}));

describe('Intergration: Core API Endpoints', () => {
  describe('GET /health', () => {
    it('returns 200 and ok status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('GET /api', () => {
    it('returns API version info', async () => {
      const res = await request(app).get('/api');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('W3B3 API');
    });
  });

  describe('GET /api/pools', () => {
    it('returns a list of pools', async () => {
      const res = await request(app).get('/api/pools');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].id).toBe('pool_1');
    });
  });

  describe('POST /api/auth/connect (Signature Revalidation)', () => {
    it('returns 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/connect')
        .send({ walletAddress: '0x123' });
      expect(res.status).toBe(400);
    });
  });
});
