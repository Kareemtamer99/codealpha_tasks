const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { redis } = require('../config/redis');

/**
 * Create a rate limiter with Redis store
 */
const createLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = 'Too many requests, please try again later.',
    prefix = 'rl:',
  } = options;

  const limiterOptions = {
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  };

  // Use Redis store if connected, otherwise fallback to memory
  try {
    if (redis.status === 'ready') {
      limiterOptions.store = new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix,
      });
    }
  } catch (e) {
    console.warn('⚠️  Rate limiter falling back to memory store');
  }

  return rateLimit(limiterOptions);
};

// Global limiter: 100 req / 15 min
const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  prefix: 'rl:global:',
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Auth limiter: 10 req / 15 min (stricter for login/register)
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  prefix: 'rl:auth:',
  message: 'Too many authentication attempts, please try again after 15 minutes.',
});

// API limiter: 60 req / 1 min
const apiLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 60,
  prefix: 'rl:api:',
  message: 'API rate limit exceeded, please try again after 1 minute.',
});

module.exports = { globalLimiter, authLimiter, apiLimiter };
