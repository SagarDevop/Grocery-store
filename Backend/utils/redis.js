const Redis = require('ioredis');
const logger = require('./logger');

/**
 * Redis Connection Configuration
 * Uses Upstash or Local Redis depending on REDIS_URL.
 */
let redis;

try {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    connectTimeout: 10000, 
    lazyConnect: true, // Don't block startup
    retryStrategy: (times) => {
      // Exponential backoff with a cap to reduce noise
      const delay = Math.min(times * 100, 5000);
      return delay;
    }
  });

  // Attempt connection
  redis.connect().catch(() => {
    // Silent catch, let error event handle logging
  });

  redis.on('connect', () => {
    // console.log('✅ Redis Connected'); // Silenced to reduce noise unless successful
  });

  redis.on('error', (err) => {
    // Only log if it's NOT a connection reset (ECONNRESET) to reduce noise
    if (err.code !== 'ECONNRESET') {
        console.error('❌ Redis Connection Error:', err);
    }
  });

} catch (err) {
  console.error('❌ Redis Init Error:', err);
}

module.exports = redis;
