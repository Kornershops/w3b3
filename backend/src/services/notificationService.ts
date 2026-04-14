import { getIo } from '../utils/socket';
import logger from '../utils/logger';

/**
 * Module 2: V3 Mobile Dominance (Alpha Channel)
 * NotificationService - Manages real-time Socket.io alerts for high-yield opportunities.
 */
export class NotificationService {
  /**
   * Broadcasts a "High Alpha" yield opportunity to all connected mobile/web clients.
   * Triggered when predictive models detect a significant bullish trend.
   */
  broadcastAlphaOpportunity(opportunity: {
    poolId: string;
    poolName: string;
    apy: number;
    trend: string;
    confidence: number;
  }) {
    try {
      const io = getIo();
      io.emit('ALPHA_OPPORTUNITY', {
        ...opportunity,
        timestamp: new Date().toISOString(),
        type: 'OPPORTUNITY_ALERT',
        priority: 'HIGH'
      });
      logger.info(`NotificationService: Broadcasted Alpha alert for Pool [${opportunity.poolName}]`);
    } catch (error) {
      logger.error('NotificationService Error:', error);
    }
  }

  /**
   * Sends a targeted rebalance notification to a specific user.
   */
  sendUserAlert(userId: string, alert: {
    action: string;
    reasoning: string;
    strategyId: string;
  }) {
    try {
      const io = getIo();
      // Assumes user has joined their private room upon connection
      io.to(`user:${userId}`).emit('REBALANCE_ALERT', {
        ...alert,
        timestamp: new Date().toISOString()
      });
      logger.info(`NotificationService: Sent targeted alert to User [${userId}]`);
    } catch (error) {
      logger.error('NotificationService User Alert Error:', error);
    }
  }
}

export const notificationService = new NotificationService();
