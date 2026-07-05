/**
 * A drop-in replacement for `fetch` that caches GET requests in sessionStorage.
 * Default cache duration is 5 minutes (300000ms).
 */
export const cachedFetch = async (url, options = {}, ttl = 300000) => {
  // Only cache GET requests
  if (options.method && options.method.toUpperCase() !== 'GET') {
    return fetch(url, options);
  }

  const cacheKey = `samikaran_cache_${url}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const { timestamp, data } = JSON.parse(cachedData);
      // Check if cache is still fresh
      if (Date.now() - timestamp < ttl) {
        // Return a mock Response object so existing code using .json() or .text() works seamlessly
        return {
          ok: true,
          status: 200,
          json: async () => JSON.parse(data),
          text: async () => data
        };
      }
    } catch (e) {
      // Ignore cache parsing errors
    }
  }

  // If not cached or expired, perform the actual fetch
  const res = await fetch(url, options);
  
  if (res.ok) {
    // Clone response so we can read the body text while still returning the original response
    const clonedRes = res.clone();
    try {
      const data = await clonedRes.text();
      sessionStorage.setItem(
        cacheKey, 
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch (e) {
      // Ignore storage errors (e.g. quota exceeded)
    }
  }

  return res;
};
