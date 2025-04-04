import express from "express";
import { body } from "express-validator";
import { signup, login } from "../controllers/authController.js";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Middleware to protect routes

const router = express.Router(); // ✅ Initialize router correctly

// Signup Route
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["MCP", "PickupPartner"])
      .withMessage("Role must be MCP or PickupPartner"),
  ],
  signup
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// Update user details (Protected Route)
router.put("/update/:id", protect, updateUser);

// Delete user (Protected Route)
router.delete("/delete/:id", protect, deleteUser);
import { signup, login } from "../controllers/authController.js";

export default router; // ✅ Export correctly
