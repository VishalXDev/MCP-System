// Core imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import http from "http";
import { Server } from "socket.io";

// Custom imports
import logger from "./logger.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket.js";
import redis from "./config/redis.js"; // Redis client
import { errorHandler } from "./middleware/errorHandler.js";
import apiLimiter from "./middleware/rateLimiter.js";
import cacheMiddleware from "./middleware/cacheMiddleware.js";

// Load env variables
dotenv.config();
const PORT = process.env.PORT || 5000;

// Create express app instance
const app = express();

// CORS config
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Basic middlewares
app.use(express.json());
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rate limiter & cache middleware
app.use("/api/auth", apiLimiter);
app.use(cacheMiddleware);

// Import routes
import authRoutes from "./routes/authRoutes.js";
import mcpRoutes from "./routes/mcpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pickupPartnerRoutes from "./routes/pickupPartnerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/mcp", mcpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/partner", pickupPartnerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Import partner routes after app initialization
import partnerRoutes from "./routes/partners.js";
app.use("/api/partners", partnerRoutes); // Mount partner routes

// Create HTTP server instance
const server = http.createServer(app);

// Create Socket.IO server and allow frontend connection
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize Socket.IO logic
initializeSocket(io);

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("joinOrderRoom", (orderId) => {
    socket.join(orderId);
    console.log(`User joined room for order: ${orderId}`);
  });

  socket.on("orderStatusUpdate", ({ orderId, status }) => {
    io.to(orderId).emit("orderStatusUpdated", { orderId, status });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB then start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Error handler middleware (must be placed last)
app.use(errorHandler);

// Export for external use (e.g., testing)
export { io, server };
