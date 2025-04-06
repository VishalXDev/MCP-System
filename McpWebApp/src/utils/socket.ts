// src/utils/socket.ts
import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket: Socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// ✅ Named export for connectSocket
export const connectSocket = (token: string | null) => {
  socket.auth = { token };
  socket.connect();
};

// ✅ Default export for socket instance
export default socket;
