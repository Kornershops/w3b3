import { poolService } from '../../src/services/poolService';
import prisma from '../../src/config/database';
import { getRedis } from '../../src/config/redis';
import logger from '../../src/utils/logger';

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    stakingPool: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn()
    }
  }
}));

jest.mock('../../src/config/redis', () => ({
  getRedis: jest.fn()
}));

jest.mock('../../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn()
}));

describe('PoolService Redis Fallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPoolById', () => {
    it('should fallback to Prisma when Redis get fails', async () => {
      const mockDbPool = { id: 'pool333', name: 'Safe Fallback Pool' };
      
      const redisMock = {
        get: jest.fn().mockRejectedValue(new Error('Redis is down')),
        setEx: jest.fn(),
      };
      (getRedis as jest.Mock).mockReturnValue(redisMock);
      
      (prisma.stakingPool.findUnique as jest.Mock).mockResolvedValue(mockDbPool);

      const result = await poolService.getPoolById('pool333');
      
      expect(redisMock.get).toHaveBeenCalledWith('pool:pool333');
      expect(logger.error).toHaveBeenCalledWith('Redis get error:', expect.any(Error));
      expect(prisma.stakingPool.findUnique).toHaveBeenCalledWith({ where: { id: 'pool333' } });
      expect(result).toEqual(mockDbPool);
    });
    
    it('should ignore Redis set errors un-disruptively and still return data', async () => {
       const mockDbPool = { id: 'pool333', name: 'Safe Fallback Pool' };
       const redisMock = {
         get: jest.fn().mockResolvedValue(null),
         setEx: jest.fn().mockRejectedValue(new Error('Redis is down'))
       };
       (getRedis as jest.Mock).mockReturnValue(redisMock);
       (prisma.stakingPool.findUnique as jest.Mock).mockResolvedValue(mockDbPool);
       
       const result = await poolService.getPoolById('pool333');
       expect(redisMock.setEx).toHaveBeenCalled();
       expect(logger.error).toHaveBeenCalledWith('Redis set error:', expect.any(Error));
       expect(result).toEqual(mockDbPool); 
    });
  });
});
