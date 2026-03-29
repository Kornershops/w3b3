import prisma from '../config/database';
import { User } from '../types';
import logger from '../utils/logger';

export class UserService {
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { walletAddress },
      });
    } catch (error) {
      logger.error('Error fetching user by wallet:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
      });
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
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data,
      });

      logger.info(`User updated: ${userId}`);
      return user;
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

  async getUserStats(userId: string) {
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
        user,
        totalStaked: totalStaked.toString(),
        totalRewards: totalRewards.toString(),
        activeStakes,
        totalStakes: stakes.length,
        stakes,
      };
    } catch (error) {
      logger.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const total = await prisma.user.count();

      const users = await prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return {
        data: users,
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
