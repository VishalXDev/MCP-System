// middleware/protectSocket.js
import jwt from "jsonwebtoken";

export const protectSocket = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    console.log("❌ Unauthorized socket connection: No token");
    return next(new Error("Unauthorized: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    // Attach user to socket instance for further use
    socket.user = decoded;

    console.log(`✅ Socket authenticated for user: ${decoded.id || decoded.email}`);
    next();
  } catch (error) {
    console.log("❌ Invalid token on socket connection:", error.message);
    return next(new Error("Unauthorized: Invalid token"));
  }
};
io.use(protectSocket);
