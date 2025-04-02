import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 📌 Middleware to verify JWT token
export const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// 📌 Middleware to check if user is MCP
export const isMCP = (req, res, next) => {
  if (!req.user || req.user.role !== "MCP") {
    return res.status(403).json({ message: "Access denied. MCP role required." });
  }
  next();
};

// 📌 Middleware to check if user is Pickup Partner
export const isPickupPartner = (req, res, next) => {
  if (!req.user || req.user.role !== "PickupPartner") {
    return res.status(403).json({ message: "Access denied. Pickup Partner role required." });
  }
  next();
};
