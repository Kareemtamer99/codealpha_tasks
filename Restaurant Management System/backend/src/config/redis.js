const Redis = require('ioredis');
const { redisUrl } = require('./env');

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

const connectRedis = async () => {
  try {
    await redis.connect();
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.warn('⚠️  App will continue without caching');
  }
};

module.exports = { redis, connectRedis };
