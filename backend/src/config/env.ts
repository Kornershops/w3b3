import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function getRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name];
  if (isProduction && !value) {
    throw new Error(`Environment variable ${name} is required in production!`);
  }
  return value || fallback || '';
}

const adminSecret = isProduction
  ? getRequiredEnv('ADMIN_SECRET')
  : getRequiredEnv('ADMIN_SECRET', 'w3b3_alpha_secure_bootstrap_77x');
const jwtSecret = isProduction
  ? getRequiredEnv('JWT_SECRET')
  : getRequiredEnv('JWT_SECRET', 'your_secret_key_change_in_production');
const jwtRefreshSecret = isProduction
  ? getRequiredEnv('JWT_REFRESH_SECRET')
  : getRequiredEnv('JWT_REFRESH_SECRET', 'w3b3_alpha_refresh_secret_default_77x');

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  adminSecret,

  database: {
    url: getRequiredEnv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/w3b3'),
    poolMin: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
  },

  redis: {
    url: getRequiredEnv('REDIS_URL', 'redis://localhost:6379'),
    password: process.env.REDIS_PASSWORD,
  },

  jwt: {
    secret: jwtSecret,
    refreshSecret: jwtRefreshSecret,
    expiry: process.env.JWT_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  web3: {
    apiKey: process.env.ALCHEMY_API_KEY || process.env.INFURA_API_KEY || '',
    alchemyApiKey: process.env.ALCHEMY_API_KEY || '',
    infuraApiKey: process.env.INFURA_API_KEY || '',
    alchemyWebhookKey: process.env.ALCHEMY_WEBHOOK_SIGNING_KEY || '',
    rpcUrl: getRequiredEnv('WEB3_RPC_URL', 'http://127.0.0.1:8545'),
  },

  cors: {
    origin: getRequiredEnv('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  features: {
    enableMemecoins: process.env.ENABLE_MEMECOIN_POOLS === 'true',
    enableReferral: process.env.ENABLE_REFERRAL_SYSTEM === 'true',
    enableGovernance: process.env.ENABLE_GOVERNANCE === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  },
};

export default config;
