const { redis } = require('../config/redis');

/**
 * Cache middleware for GET requests
 * @param {number} ttl - Time to live in seconds (default 60)
 * @param {string} prefix - Cache key prefix
 */
const cache = (ttl = 60, prefix = 'cache') => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();

    // Skip if Redis is not connected
    if (redis.status !== 'ready') return next();

    const key = `${prefix}:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        const data = JSON.parse(cached);
        return res.status(200).json({ ...data, _cached: true });
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.setex(key, ttl, JSON.stringify(body)).catch(() => {});
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      // If caching fails, continue without cache
      next();
    }
  };
};

/**
 * Invalidate cache by prefix pattern
 * @param {string} prefix - Pattern to match cache keys
 */
const invalidateCache = async (prefix) => {
  if (redis.status !== 'ready') return;

  try {
    const stream = redis.scanStream({ match: `${prefix}:*`, count: 100 });
    const pipeline = redis.pipeline();

    stream.on('data', (keys) => {
      keys.forEach((key) => pipeline.del(key));
    });

    stream.on('end', () => {
      pipeline.exec().catch(() => {});
    });
  } catch (error) {
    console.error('Cache invalidation error:', error.message);
  }
};

module.exports = { cache, invalidateCache };
