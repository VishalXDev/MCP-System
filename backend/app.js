import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import compression from "compression";
import Redis from "ioredis";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js"; // ✅ Ensure this path is correct
import logger from "./src/logger.js";
import cacheMiddleware from "./src/middleware/cacheMiddleware.js";
import { initializeSocket } from "./src/socket.io/initializeSocket.js";
import apiLimiter from "./src/middleware/rateLimiter.js";

// ✅ Load environment variables first
dotenv.config();

// ✅ Initialize Express BEFORE using it
const app = express();

// ✅ Apply middleware before routes
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ✅ Apply rate limiter and caching BEFORE routes
app.use("/api/auth", apiLimiter);
app.use(cacheMiddleware);

// Import routes AFTER app is declared
import authRoutes from "./src/routes/authRoutes.js";
import mcpRoutes from "./src/routes/mcpRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import pickupPartnerRoutes from "./src/routes/pickupPartnerRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/mcp", mcpRoutes);
app.use("/api/partner", pickupPartnerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

// ✅ Create HTTP server **after** app is initialized
const server = http.createServer(app);

// ✅ Initialize Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
});

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

// ✅ WebSocket Event Listeners
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("joinOrderRoom", (orderId) => {
    socket.join(orderId);
    console.log(`User joined order room: ${orderId}`);
  });

  socket.on("orderStatusUpdate", ({ orderId, status }) => {
    io.to(orderId).emit("orderStatusUpdated", { orderId, status });
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// ✅ Connect to MongoDB & Start Server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  });

// ✅ Export for external use if needed
export { io, server };
