import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  logLevel: process.env.LOG_LEVEL || 'info',

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/w3b3',
    poolMin: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret_key_change_in_production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_change_in_production',
    expiry: process.env.JWT_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // Web3
  web3: {
    alchemyApiKey: process.env.ALCHEMY_API_KEY || '',
    alchemyWebhookKey: process.env.ALCHEMY_WEBHOOK_SIGNING_KEY || '',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Email (Optional)
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },

  // Feature Flags
  features: {
    enableMemecoins: process.env.ENABLE_MEMECOIN_POOLS === 'true',
    enableReferral: process.env.ENABLE_REFERRAL_SYSTEM === 'true',
    enableGovernance: process.env.ENABLE_GOVERNANCE === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  },
};

export default config;
