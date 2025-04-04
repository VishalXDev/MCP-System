// ✅ Import Modules
import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import compression from "compression";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import logger from "./logger.js";
import apiLimiter from "./middleware/rateLimiter.js";
import cacheMiddleware from "./middleware/cacheMiddleware.js";
import { initializeSocket } from "./socket.io/initializeSocket.js";
import Redis from "ioredis"; // ✅ Import Redis ONCE at the top

// ✅ Route Imports
import authRoutes from "./routes/authRoutes.js";
import mcpRoutes from "./routes/mcpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pickupPartnerRoutes from "./routes/pickupPartnerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express
const app = express();

// ✅ Middleware setup
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
initializeSocket(io);

// ✅ Apply Middleware (before routes)
app.use("/api/auth", apiLimiter);
app.use(cacheMiddleware);

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/mcp", mcpRoutes);
app.use("/api/partner", pickupPartnerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

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

// ✅ Connect to MongoDB and Start Server
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

// ✅ Redis Configuration (Only Declared Once)
const redis = new Redis(
  "redis://default:BTKJ2kD0ByWoyN1qdMACv8winE9YOMVN@redis-12388.c301.ap-south-1-1.ec2.redns.redis-cloud.com:12388"
);

redis.on("connect", () => {
  console.log("✅ Redis Connected!");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);
const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);

// ✅ Export for external use
export { io, server, redis };
