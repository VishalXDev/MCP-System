import { Server } from "socket.io";
import { protectSocket } from "../middleware/protectSocket.js";

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(protectSocket);

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Join room for order tracking
    socket.on("joinOrder", ({ orderId }) => {
      socket.join(orderId);
      console.log(`Socket ${socket.id} joined room for order ${orderId}`);
    });

    // Notifications
    socket.on("sendNotification", (data) => {
      console.log("Notification sent:", data);
      socket.emit("receiveNotification", data);
    });

    // Location tracking
    socket.on("updateLocation", ({ orderId, lat, lng }) => {
      console.log(`Updating location for order: ${orderId}`);
      io.to(orderId).emit("locationUpdate", { lat, lng });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

export const getSocketIO = () => {
  if (!io) throw new Error("Socket.IO has not been initialized yet!");
  return io;
};

export { io };
