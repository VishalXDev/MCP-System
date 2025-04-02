// socket.io/initializeSocket.js

import { Server } from "socket.io";  // Import the Socket.IO server
import { protectSocket } from '../middleware/protectSocket.js';


let io = null;  // Declare io variable to be initialized later

// Function to initialize the socket connection
export const initializeSocket = (server) => {
  // Initialize Socket.IO with the HTTP server
  io = new Server(server, {
    cors: {
      origin: "*",  // Allow connections from any origin; change this as needed
      methods: ["GET", "POST"],
    },
  });

  // Protect all socket connections using the middleware
  io.use(protectSocket);  // Use protectSocket middleware to check authentication

  // Handle incoming socket connections
  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Handle event for sending notifications
    socket.on("sendNotification", (data) => {
      console.log("Notification sent:", data);
      socket.emit("receiveNotification", data);  // Emit back to the same client
    });

    // Handle event for updating location of an order
    socket.on("updateLocation", ({ orderId, lat, lng }) => {
      console.log(`Updating location for order: ${orderId}`);
      io.to(orderId).emit("locationUpdate", { lat, lng });  // Emit to the specific order room
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

// Function to get the initialized io instance
export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet!");
  }
  return io;
};

export { io };
