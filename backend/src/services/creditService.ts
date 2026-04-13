import prisma from '../config/database';
import logger from '../utils/logger';

export class CreditService {
  async getCreditPositions(userId: string) {
    try {
      const positions = await prisma.creditPosition.findMany({
        where: { userId, isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
      return positions;
    } catch (error) {
      logger.error('Error fetching credit positions:', error);
      throw error;
    }
  }

  async getCreditPosition(id: string) {
    try {
      return await prisma.creditPosition.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error('Error fetching credit position:', error);
      throw error;
    }
  }

  async openPosition(data: {
    userId: string;
    collateralAsset: string;
    borrowedAsset: string;
    collateralAmount: string; // High precision string
    borrowedAmount: string; // High precision string
  }) {
    try {
      const position = await prisma.creditPosition.create({
        data: {
          ...data,
          healthFactor: 2.0, // Mock healthy initial factor. In production, calculate via oracle
        },
      });

      logger.info(`Credit position opened: ${position.id} by user: ${data.userId}`);
      return position;
    } catch (error) {
      logger.error('Error opening credit position:', error);
      throw error;
    }
  }

  async updatePosition(id: string, data: {
    collateralAmount?: string;
    borrowedAmount?: string;
    healthFactor?: number;
    isActive?: boolean;
  }) {
    try {
      const position = await prisma.creditPosition.update({
        where: { id },
        data,
      });

      logger.info(`Credit position updated: ${id}`);
      return position;
    } catch (error) {
      logger.error('Error updating credit position:', error);
      throw error;
    }
  }

  async liquidatePosition(id: string, liquidatorId: string) {
    try {
      // Logic would typically include verifying health factor < 1.0 using oracle
      const position = await prisma.creditPosition.update({
        where: { id },
        data: {
          isActive: false,
          healthFactor: 0.0,
        },
      });

      logger.info(`Credit position liquidated: ${id} by liquidator: ${liquidatorId}`);
      return position;
    } catch (error) {
      logger.error('Error liquidating credit position:', error);
      throw error;
    }
  }
}

export const creditService = new CreditService();
