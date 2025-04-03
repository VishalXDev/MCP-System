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
import redis from "./config/redis.js";

// ✅ Load environment variables first
dotenv.config();

// ✅ MOVE ALL ROUTE IMPORTS TO THE TOP
import authRoutes from "./routes/authRoutes.js";
import mcpRoutes from "./routes/mcpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pickupPartnerRoutes from "./routes/pickupPartnerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

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

// ✅ Register Routes (AFTER importing them)
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

// ✅ Redis Test
redis.set("test_key", "Hello from Redis", "EX", 60);
redis.get("test_key", (err, result) => {
  if (err) console.error(err);
  console.log("Redis Test Value:", result);
});

// ✅ Export for external use
export { io, server };
