// middleware/cacheMiddleware.js
const cacheMiddleware = async (req, res, next) => {
    const cachedData = await redis.get(req.originalUrl); // Look for cached data by the URL
    if (cachedData) {
      return res.json(JSON.parse(cachedData)); // Return cached response
    }
    next(); // Continue to the route handler
  };
  
  export default cacheMiddleware;
  