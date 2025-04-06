import { Server } from "socket.io";

let io = null; // Socket.IO instance

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend domain in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Client joins a specific order room
    socket.on("joinOrderRoom", (orderId) => {
      socket.join(orderId);
      console.log(`User joined order room: ${orderId}`);
    });

    // Send a notification to the client
    socket.on("sendNotification", (data) => {
      console.log("Notification sent:", data);
      socket.emit("receiveNotification", data);
    });

    // Handle order status updates
    socket.on("orderStatusUpdate", ({ orderId, status }) => {
      io.to(orderId).emit("orderStatusUpdated", { orderId, status });
    });

    // Handle location updates
    socket.on("updateLocation", ({ orderId, lat, lng }) => {
      console.log(`Location update for order ${orderId}: ${lat}, ${lng}`);
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
