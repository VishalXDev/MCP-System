import { Server } from "socket.io";

// Initialize io as null initially
let io = null;

// Function to initialize the socket
export const initializeSocket = (server) => {
  // Initialize the Socket.IO server
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust based on frontend URL
      methods: ["GET", "POST"],
    },
  });

  // Handle new connections
  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Handle events from the client
    socket.on("sendNotification", (data) => {
      console.log("Notification sent:", data);
      socket.emit("receiveNotification", data); // Send notification back to the same client
    });

    socket.on("updateLocation", ({ orderId, lat, lng }) => {
      console.log(`Updating location for order: ${orderId}`);
      io.to(orderId).emit("locationUpdate", { lat, lng }); // Emit to the specific order room
    });

    // Join a room for a specific order (you can use this for tracking order-related events)
    socket.on("joinOrderRoom", (orderId) => {
      socket.join(orderId);
      console.log(`User joined order room: ${orderId}`);
    });

    // Emit status updates to a specific room (order)
    socket.on("orderStatusUpdate", ({ orderId, status }) => {
      io.to(orderId).emit("orderStatusUpdated", { orderId, status });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

// Export the io instance to use in other parts of the app
export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet!");
  }
  return io;
};

// Optionally export `io` to access it directly if needed
// In your socket setup
socket.on("locationUpdate", ({ orderId, latitude, longitude }) => {
  io.to(orderId).emit("locationUpdated", { latitude, longitude });
});

export { io };
