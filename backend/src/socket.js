// backend/src/socket.js
import { Server } from "socket.io";

let io;
const connectedUsers = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
      connectedUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      connectedUsers.forEach((value, key) => {
        if (value === socket.id) connectedUsers.delete(key);
      });
      console.log("User disconnected:", socket.id);
    });
  });
};

const sendNotification = (userId, message) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("notification", message);
  }
};

export { initializeSocket, sendNotification };
