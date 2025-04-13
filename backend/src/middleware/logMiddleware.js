// middleware/logMiddleware.js
import SystemLog from "../models/SystemLog.js";

// 📌 Middleware to log user actions
const logMiddleware = (action) => {
  return async (req, res, next) => {
    try {
      const user = req.user ? req.user.id : "Unknown";

      await SystemLog.create({
        user,
        action,
        details: {
          method: req.method,
          path: req.originalUrl,
          body: req.body,
          params: req.params,
          query: req.query,
        },
      });
    } catch (error) {
      console.error("Error logging action:", error);
    }

    next();
  };
};

export default logMiddleware;
