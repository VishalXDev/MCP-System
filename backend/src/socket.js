// backend/src/socket.js
import { Server } from "socket.io";

let io;
const connectedUsers = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Change to your frontend origin in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // Register user with their userId
    socket.on("register", (userId) => {
      if (userId) {
        connectedUsers.set(userId, socket.id);
        console.log(`✅ Registered user ${userId} with socket ${socket.id}`);
      }
    });

    // Remove user from map on disconnect
    socket.on("disconnect", () => {
      for (const [userId, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`❌ Disconnected user ${userId} with socket ${socket.id}`);
          break;
        }
      }
    });
  });
};

// Send notification to a user if they're connected
const sendNotification = (userId, message) => {
  const socketId = connectedUsers.get(userId);
  if (socketId && io) {
    io.to(socketId).emit("notification", message);
    console.log(`📤 Notification sent to ${userId} (${socketId})`);
  } else {
    console.log(`⚠️ User ${userId} not connected`);
  }
};

export { initializeSocket, sendNotification };
