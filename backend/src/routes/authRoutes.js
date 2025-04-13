import express from "express";
import { body, validationResult } from "express-validator";
import { signup, login } from "../controllers/authController.js";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Validation Middleware Reusable
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ✅ Signup Route
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone")
      .notEmpty().withMessage("Phone number is required")
      .matches(/^[0-9]{10,15}$/).withMessage("Invalid phone number"),
    body("password")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role")
      .isIn(["admin", "mcp", "pickupPartner"])
      .withMessage("Role must be admin, mcp, or pickupPartner"),
  ],
  handleValidation,
  signup
);

// ✅ Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidation,
  login
);

// 🔐 Update user (Protected)
router.put(
  "/update/:id",
  protect,
  [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("phone").optional().matches(/^[0-9]{10,15}$/).withMessage("Invalid phone number"),
    body("role").optional().isIn(["admin", "mcp", "pickupPartner"]).withMessage("Invalid role"),
  ],
  handleValidation,
  updateUser
);

// 🗑️ Delete user (Protected)
router.delete("/delete/:id", protect, deleteUser);

export default router;
