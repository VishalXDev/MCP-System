// src/utils/socket.ts
import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Optionally include token auth (if backend expects it)
const token = localStorage.getItem("token");

const socket: Socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  auth: {
    token, // Your backend must read it from socket.handshake.auth.token
  },
});

export default socket;
