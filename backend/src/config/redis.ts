import { createClient } from 'redis';
import { config } from './env';

import logger from '../utils/logger';

let redis: ReturnType<typeof createClient> | null = null;

export async function initializeRedis(): Promise<ReturnType<typeof createClient>> {
  redis = createClient({
    url: config.redis.url,
    password: config.redis.password,
  });

  redis.on('error', (err) => logger.error('Redis Client Error', err));
  redis.on('connect', () => logger.info('Redis Client Connected'));

  await redis.connect();
  return redis;
}

export function getRedis(): ReturnType<typeof createClient> {
  if (!redis) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redis;
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
  }
}

export { redis };
