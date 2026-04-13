import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import logger from '../utils/logger';

/**
 * Middleware to enforce KYC status for institutional actions.
 */
export const requireKYC = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Assumes auth middleware has populated req.user
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not found in request context.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true, isInstitutional: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in system.' });
    }

    if (user.kycStatus !== 'VERIFIED') {
      return res.status(403).json({
        error: 'Forbidden: Action requires Verified KYC status.',
        currentStatus: user.kycStatus,
      });
    }

    next();
  } catch (error) {
    logger.error('KYC Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error during compliance verification.' });
  }
};

/**
 * Middleware to enforce Institutional status for restricted pools.
 */
export const requireInstitutional = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Assumes auth middleware has populated req.user
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isInstitutional: true },
    });

    if (!user || !user.isInstitutional) {
      return res.status(403).json({
        error: 'Forbidden: Access restricted to institutional accounts only.',
      });
    }

    next();
  } catch (error) {
    logger.error('Institutional Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error during institutional verification.' });
  }
};
