import { Server } from "socket.io";

let io;

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this if needed for security
    },
  });
  return io;
};

export const getSocketIO = () => {
  if (!io) throw new Error("Socket.io is not initialized");
  return io;
};