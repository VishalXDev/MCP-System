import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create socket instance
const socket: Socket = io(BACKEND_URL, {
  transports: ["websocket"],  // Ensures WebSocket is used
  autoConnect: false,          // Prevent auto connection on load
});

// Function to connect the socket (if needed)
export const connectSocket = (token: string | null) => {
  if (token) {
    socket.auth = { token };  // Send token for authentication
  }
  socket.connect();  // Manually connect
};

// Function to disconnect the socket
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
