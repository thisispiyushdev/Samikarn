const cache = new Map();

export const cacheMiddleware = (durationInSeconds = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // We use the base URL (without query params) as the prefix key, 
    // or the full URL if we want to cache per query
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse && cachedResponse.expiry > Date.now()) {
      return res.status(200).json(cachedResponse.data);
    }
    
    // Override res.json to capture response
    const originalJson = res.json;
    res.json = function(body) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300 && body.success !== false) {
        cache.set(key, {
          data: body,
          expiry: Date.now() + (durationInSeconds * 1000)
        });
      }
      originalJson.call(this, body);
    };
    next();
  };
};

export const clearCache = (prefix) => {
  return (req, res, next) => {
    if (prefix) {
      for (let key of cache.keys()) {
        if (key.startsWith(prefix)) {
          cache.delete(key);
        }
      }
    } else {
      cache.clear();
    }
    next();
  };
};
