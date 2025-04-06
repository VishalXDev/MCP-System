import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🔐 Middleware to protect routes using JWT
export const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 🎯 Role-based middleware: Only for Admins (MCP)
export const isMCP = (req, res, next) => {
  if (req.user?.role !== "MCP") {
    return res
      .status(403)
      .json({ message: "Access denied. MCP role required." });
  }
  next();
};

// 🎯 Role-based middleware: Only for Pickup Partners
export const isPickupPartner = (req, res, next) => {
  if (req.user?.role !== "PickupPartner") {
    return res
      .status(403)
      .json({ message: "Access denied. Pickup Partner role required." });
  }
  next();
};

// 🧪 Optional basic token-only middleware (no DB lookup)
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
