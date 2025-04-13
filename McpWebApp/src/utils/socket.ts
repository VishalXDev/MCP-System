import { io, Socket } from "socket.io-client";

// Backend URL from environment variable or fallback to localhost
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create a Socket.IO instance with specific configurations
const socket: Socket = io(URL, {
  transports: ["websocket"], // Using WebSocket as the transport method
  autoConnect: false, // Do not auto-connect until explicitly called
  reconnection: true, // Enable automatic reconnection
  reconnectionAttempts: 5, // Maximum number of reconnection attempts
  reconnectionDelay: 1000, // Time delay between reconnection attempts (in ms)
  reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts (in ms)
});

// Named export to allow connection with authentication token
export const connectSocket = (token: string | null) => {
  // Attach token to the socket instance for authentication
  if (token) {
    socket.auth = { token };
  }
  socket.connect(); // Manually connect the socket
};

// Default export for socket instance to be used in other modules
export default socket;
