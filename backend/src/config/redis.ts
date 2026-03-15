import { createClient } from 'redis';
import { config } from './env';

let redis: ReturnType<typeof createClient>;

export async function initializeRedis() {
  redis = createClient({
    url: config.redis.url,
    password: config.redis.password,
  });

  redis.on('error', (err) => console.error('Redis Client Error', err));
  redis.on('connect', () => console.log('Redis Client Connected'));

  await redis.connect();
  return redis;
}

export function getRedis() {
  if (!redis) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redis;
}

export async function closeRedis() {
  if (redis) {
    await redis.quit();
  }
}

export default redis;
