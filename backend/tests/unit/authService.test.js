const { authService } = require('../../dist/services/authService');
const { ethers } = require('ethers');

// Mock the nested dependencies so we don't hit real Prisma instances in unit tests
jest.mock('../../dist/services/userService', () => ({
  userService: {
    getOrCreateUser: jest.fn().mockResolvedValue({ id: 'user_1', walletAddress: '0x1A2b3c', role: 'USER' }),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateWalletAddress', () => {
    it('returns true for a valid EVM address', async () => {
      const validAddress = ethers.Wallet.createRandom().address;
      const isValid = await authService.validateWalletAddress(validAddress);
      expect(isValid).toBe(true);
    });

    it('returns false for an invalid address string', async () => {
      const isValid = await authService.validateWalletAddress('0xNotAnAddress123');
      expect(isValid).toBe(false);
    });
  });

  describe('validateMessage', () => {
    it('returns true for standard login messages', async () => {
      const msg = 'Welcome to W3B3. Please sign to authenticate.';
      const isValid = await authService.validateMessage(msg);
      expect(isValid).toBe(true);
    });

    it('returns false for empty messages', async () => {
      const isValid = await authService.validateMessage('');
      expect(isValid).toBe(false);
    });
  });

  describe('verifySignature', () => {
    it('returns true when signature matches the payload', async () => {
      const wallet = ethers.Wallet.createRandom();
      const message = 'Test payload';
      
      const signature = await wallet.signMessage(message);
      const isValid = await authService.verifySignature(wallet.address, message, signature);
      
      expect(isValid).toBe(true);
    });

    it('returns false when signature does not belong to the claiming address', async () => {
      const walletTrue = ethers.Wallet.createRandom();
      const walletFake = ethers.Wallet.createRandom();
      const message = 'Test payload';
      
      const signature = await walletTrue.signMessage(message);
      
      const isValid = await authService.verifySignature(walletFake.address, message, signature);
      
      expect(isValid).toBe(false);
    });
  });
});
