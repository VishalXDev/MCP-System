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

    // Intercept res.json to store the response in Redis
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      try {
        await redis.set(cacheKey, JSON.stringify(body), 'EX', 300); // Cache for 5 minutes
        console.log(`📦 Cached response for ${cacheKey}`);
      } catch (err) {
        console.error("⚠️ Redis set error:", err.message);
      }
      return originalJson(body);
    };

    next();
  } catch (error) {
    console.error("❌ Redis cache middleware error:", error.message);
    next(); // Proceed without caching
  }
};

export default cacheMiddleware;
