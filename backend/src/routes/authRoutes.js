import express from "express";
import { body, validationResult } from "express-validator"; // Import validationResult to handle errors
import { signup, login } from "../controllers/authController.js";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

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
      .isIn(["admin", "mcp", "pickupPartner"]) // Updated to match the schema roles
      .withMessage("Role must be admin, mcp, or pickupPartner"),
  ],
  (req, res, next) => {
    const errors = validationResult(req); // Get validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    next(); // Proceed to the signup controller
  },
  signup
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req); // Get validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    next(); // Proceed to the login controller
  },
  login
);

// Update user details (Protected)
router.put("/update/:id", protect, updateUser);

// Delete user (Protected)
router.delete("/delete/:id", protect, deleteUser);

export default router;
