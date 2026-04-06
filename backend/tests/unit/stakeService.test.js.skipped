const { stakeService } = require('../../src/services/stakeService');
const prisma = require('../../src/config/database').default;

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    userStake: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    reward: {
      create: jest.fn(),
    }
  }
}));

describe('StakeService Units', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStake', () => {
    it('should create a stake successfully', async () => {
      const mockStakeData = {
        userId: 'user123',
        poolId: 'pool456',
        amountStaked: '100.5',
        transactionHash: '0xabc123'
      };

      const mockCreatedStake = { 
        id: 'stake789', 
        ...mockStakeData, 
        isActive: true,
        stakedAt: new Date(),
        unstakedAt: null,
        rewardsClaimed: '0',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      prisma.userStake.create.mockResolvedValue(mockCreatedStake);

      const result = await stakeService.createStake(mockStakeData);

      expect(prisma.userStake.create).toHaveBeenCalled();
      expect(result.id).toEqual('stake789');
      expect(result.amountStaked).toEqual('100.5');
    });

    it('should bubble up database errors on stake creation', async () => {
      prisma.userStake.create.mockRejectedValue(new Error('Constraint failed'));

      await expect(stakeService.createStake({
        userId: 'user123',
        poolId: 'pool456',
        amountStaked: '100',
        transactionHash: '0x123'
      })).rejects.toThrow('Constraint failed');
    });
  });
});
