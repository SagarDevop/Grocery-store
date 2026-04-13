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
    maxRetriesPerRequest: null, // Required for BullMQ
    connectTimeout: 10000, 
    enableKeepAlive: true,
    keepAlive: 30000, // Ping every 30s
    family: 4, // Force IPv4 to avoid resolution issues
    retryStrategy: (times) => {
      // Exponential backoff with a cap
      const delay = Math.min(times * 200, 5000);
      return delay;
    },
    reconnectOnError: (err) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true; // Force reconnect on READONLY errors
      }
      return false;
    }
  });

  redis.on('connect', () => {
    // Only log once to avoid cluttering during retries
    if (redis.status === 'connecting') {
      console.log('📡 Redis Connecting...');
    }
  });

  redis.on('ready', () => {
    console.log('✅ Redis Ready and Connected');
  });

  redis.on('reconnecting', (ms) => {
    // Log as a subtle warning instead of an error
    console.log(`🔄 Redis Reconnecting in ${ms}ms...`);
  });

  redis.on('error', (err) => {
    // Filter out common cloud reset errors from being full-blown error logs
    if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
      return; // Quietly let ioredis handle the retry
    }
    console.error('❌ Redis Critical Error:', err);
  });

} catch (err) {
  console.error('❌ Redis Init Error:', err);
}

module.exports = redis;
