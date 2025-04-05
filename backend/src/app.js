import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import http from "http";
import { Server } from "socket.io";
import logger from "./logger.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket.js";
import redis from "./config/redis.js"; // ✅ Use shared Redis client

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Custom middleware
import apiLimiter from "./middleware/rateLimiter.js";
import cacheMiddleware from "./middleware/cacheMiddleware.js";

app.use("/api/auth", apiLimiter);
app.use(cacheMiddleware);

// Routes
import authRoutes from "./routes/authRoutes.js";
import mcpRoutes from "./routes/mcpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pickupPartnerRoutes from "./routes/pickupPartnerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/mcp", mcpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/partner", pickupPartnerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

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

// Start Mongo + Server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

export { io, server };
