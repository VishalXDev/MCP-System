import express from "express";
import { body } from "express-validator";
import { signup, login } from "../controllers/authController.js";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Protect route middleware
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
// const router = express.Router();

// Signup Route
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["MCP", "PickupPartner"]).withMessage("Role must be MCP or PickupPartner"),
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

// Update user
router.put("/update/:id", protect, updateUser);

// Delete user
router.delete("/delete/:id", protect, deleteUser);
const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

export default router;
