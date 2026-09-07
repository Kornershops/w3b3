import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initSocket } from './utils/socket';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';
import { PrismaClient } from '@prisma/client';
import { JsonRpcProvider } from 'ethers';
import config from './config/env';

import authRoutes from './routes/auth';
import poolRoutes from './routes/pools';
import stakeRoutes from './routes/stakes';
import portfolioRoutes from './routes/portfolio';
import adminRoutes from './routes/admin';
import userRoutes from './routes/users';
import yieldRoutes from './routes/yield';
import recursiveRoutes from './routes/recursive';
import treasuryRoutes from './routes/treasury';
import zapRoutes from './routes/zaps';
import vaultRoutes from './routes/vaults';
import governanceRoutes from './routes/governance';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const web3Provider = new JsonRpcProvider(config.web3.rpcUrl);
const PORT = config.port;
const httpServer = createServer(app);
initSocket(httpServer);

// Global Anti-DDoS Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { error: 'Too many requests generated from this IP, please try again after 15 minutes.' }
});
app.use(limiter);

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    const envOrigin = process.env.CORS_ORIGIN;
    const allowed = ['http://localhost:3000', 'https://w33b3.netlify.app', 'https://w3bs3.netlify.app'];
    
    if (envOrigin) {
      if (envOrigin.includes(',')) {
        allowed.push(...envOrigin.split(',').map(o => o.trim()));
      } else {
        allowed.push(envOrigin);
      }
    }

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS Rejecting origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Liveness check: the process is running and can serve requests.
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
  });
});

// Readiness check: both authoritative persistence and Web3 RPC must be reachable.
app.get('/readyz', async (req, res) => {
  const checks: { database: string; web3Rpc: string; chainId?: string } = {
    database: 'unknown',
    web3Rpc: 'unknown',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'connected';
  } catch (error) {
    logger.error('Readiness database probe failed', error);
    checks.database = 'disconnected';
  }

  try {
    const network = await web3Provider.getNetwork();
    checks.web3Rpc = 'connected';
    checks.chainId = network.chainId.toString();
  } catch (error) {
    logger.error('Readiness Web3 RPC probe failed', error);
    checks.web3Rpc = 'disconnected';
  }

  const ready = checks.database === 'connected' && checks.web3Rpc === 'connected';
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks,
  });
});

// API Routes
app.get('/api', (req: express.Request, res: express.Response): void => {
  res.json({ message: 'W3B3 API v1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/stakes', stakeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/yield', yieldRoutes);
app.use('/api/recursive', recursiveRoutes);
app.use('/api/treasury', treasuryRoutes);
app.use('/api/zaps', zapRoutes);
app.use('/api/vaults', vaultRoutes);
app.use('/api/governance', governanceRoutes);

// Error handling middleware
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  logger.error('Unhandled error: %o', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

import cron from 'node-cron';
import { yieldService } from './services/yieldService';

// Start server
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    
    // Initial sync on boot
    yieldService.syncYieldData().catch(err => logger.error('Initial sync failed', err));

    // Schedule sync every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      logger.info('⏰ Running Scheduled Analytics Sync...');
      try {
        await yieldService.syncYieldData();
      } catch (err) {
        logger.error('Scheduled sync failed', err);
      }
    });
  });
}

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  httpServer.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      web3Provider.destroy();
      logger.info('Prisma disconnected.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
