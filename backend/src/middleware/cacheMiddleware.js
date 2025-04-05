// middleware/cacheMiddleware.js
import redis from "../config/redis.js";

const cacheMiddleware = async (req, res, next) => {
  try {
    const cacheKey = req.originalUrl;

    // Try to get cached response
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log(`🚫 Cache miss for ${cacheKey}`);

    // Intercept the response to cache it after sending
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.setex(cacheKey, 300, JSON.stringify(body)); // Cache for 5 minutes
      return originalJson(body);
    };

    next();
  } catch (error) {
    console.error("Redis cache error:", error.message);
    next(); // Continue without caching if Redis fails
  }
};

export default cacheMiddleware;
