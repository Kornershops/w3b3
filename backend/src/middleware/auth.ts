import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload } from '../types';

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void | Response {
  try {
    // 1. Check Cookies (Primary)
    let token = req.cookies?.accessToken;

    // 2. Check Authorization Header (Fallback)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Missing authentication' });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = decoded;
    }

    next();
  } catch (error) {
    next();
  }
}

export function authAdminMiddleware(req: Request, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ error: 'Requires admin privileges' });
    }
  });
}

export function setTokenCookies(res: Response, token: string, refreshToken: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function generateToken(userId: string, walletAddress: string, role: string): string {
  const secret = config.jwt.secret as string;
  return jwt.sign(
    { userId, walletAddress, role },
    secret,
    { expiresIn: config.jwt.expiry as any }
  );
}

export function generateRefreshToken(userId: string, walletAddress: string, role: string): string {
  const refreshSecret = config.jwt.refreshSecret as string;
  return jwt.sign(
    { userId, walletAddress, role },
    refreshSecret,
    { expiresIn: config.jwt.refreshExpiry as any }
  );
}
