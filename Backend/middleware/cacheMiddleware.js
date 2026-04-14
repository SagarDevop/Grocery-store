const redis = require('../utils/redis');

/**
 * Cache Middleware
 * @param {number} duration - Cache TTL in seconds.
 * 
 * Intercepts res.json, stores content in Redis, 
 * and serves future requests from cache until expired.
 */
const cache = (duration) => {
  return async (req, res, next) => {
    // 1. Skip if not a GET request
    if (req.method !== 'GET') return next();

    // 2. Skip if Redis is not initialized or not ready
    // Status check prevents hanging on 'connecting' state
    if (!redis || redis.status !== 'ready') {
      // console.warn('⚠️ Cache skipped: Redis not ready (status: ' + (redis?.status || 'missing') + ')');
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    
    try {
      // 3. Implemented a 1-second timeout for cache lookups
      // This prevents the entire request from hanging if Redis stalls
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis Timeout')), 1000)
      );

      const cachedBody = await Promise.race([
        redis.get(key),
        timeoutPromise
      ]);

      if (cachedBody) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Cache', 'HIT');
        return res.send(cachedBody);
      } else {
        // Cache MISS - intercept response to store content
        res.sendResponse = res.json;
        res.json = (body) => {
          // Store in redis (non-blocking)
          redis.set(key, JSON.stringify(body), 'EX', duration).catch(e => 
            console.error('Redis Set Error:', e)
          );
          res.setHeader('X-Cache', 'MISS');
          res.sendResponse(body);
        };
        next();
      }
    } catch (err) {
      // 4. Graceful fallback on any Redis error (timeout, network, etc)
      console.error('🛡️ Cache Resiliency Triggered:', err.message);
      next();
    }
  };
};

module.exports = cache;
