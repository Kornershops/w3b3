import prisma from '../config/database';
import { User, UserStake, StakingPool } from '../types';
import logger from '../utils/logger';
import { mapUser, mapStake } from '../utils/mappers';

export class UserService {
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
      });
      return user ? mapUser(user) : null;
    } catch (error) {
      logger.error('Error fetching user by wallet:', error);
      throw error;
    }
  }


  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user ? mapUser(user) : null;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  async createUser(data: {
    walletAddress: string;
    chainId?: number;
    referredById?: string;
  }): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
          points: data.referredById ? 50 : 0 // Bonus for being referred
        },
      });

      logger.info(`User created: ${user.id}`);
      return mapUser(user);
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async updateStake(stakeId: string, data: Partial<UserStake>): Promise<UserStake> {
    try {
      // Structural Fix: Extract only valid Prisma fields from the Shared DTO
      const { pool, user, ...prismaData } = data as any;
      
      const stake = await prisma.userStake.update({
        where: { id: stakeId },
        data: prismaData,
      });

      logger.info(`Stake updated: ${stakeId}`);
      return mapStake(stake);
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    try {
      // Structural Fix: Extract only valid Prisma fields from the Shared DTO
      const { ...prismaData } = data as any;

      const user = await prisma.user.update({
        where: { id: userId },
        data: prismaData,
      });

      logger.info(`User updated: ${userId}`);
      return mapUser(user);
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async getOrCreateUser(walletAddress: string, referralCode?: string): Promise<User> {
    try {
      let user = await this.getUserByWallet(walletAddress);

      if (!user) {
        let referredById: string | undefined = undefined;

        if (referralCode) {
          const referrer = await prisma.user.findUnique({
            where: { referralCode }
          });
          
          if (referrer) {
            referredById = referrer.id;
            // Reward the referrer natively
            await prisma.user.update({
              where: { id: referrer.id },
              data: { points: { increment: 100 } }
            });
          }
        }

        user = await this.createUser({ walletAddress, referredById });
      }

      return user;
    } catch (error) {
      logger.error('Error getting or creating user:', error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<{
    user: User;
    totalStaked: string;
    totalRewards: string;
    activeStakes: number;
    totalStakes: number;
    stakes: any[];
  }> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get stakes
      const stakes = await prisma.userStake.findMany({
        where: { userId },
        include: { pool: true },
      });

      // Calculate stats
      const totalStaked = stakes.reduce((sum, stake) => {
        return sum + parseFloat(stake.amountStaked.toString());
      }, 0);

      const totalRewards = stakes.reduce((sum, stake) => {
        return sum + parseFloat(stake.rewardsClaimed.toString());
      }, 0);

      const activeStakes = stakes.filter((s) => s.isActive).length;

      return {
        user: mapUser(user),
        totalStaked: totalStaked.toString(),
        totalRewards: totalRewards.toString(),
        activeStakes,
        totalStakes: stakes.length,
        stakes: stakes.map(mapStake),
      };
    } catch (error) {
      logger.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 20): Promise<{
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const skip = (page - 1) * limit;

      const total = await prisma.user.count();

      const users = await prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return {
        data: users.map(mapUser),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw error;
    }
  }

  async getTotalUsers(): Promise<number> {
    try {
      return await prisma.user.count();
    } catch (error) {
      logger.error('Error counting users:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
