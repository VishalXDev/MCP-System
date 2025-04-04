import express from "express";
import {
  getAllUsers,
  addPartner,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users
router.get("/", protect, getAllUsers);

// Add new partner
router.post("/partner", protect, addPartner);

// Update user
router.put("/:id", protect, updateUser);

// Delete user
router.delete("/:id", protect, deleteUser);

export default router;
