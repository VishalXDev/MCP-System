// src/socket.ts
import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket: Socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
