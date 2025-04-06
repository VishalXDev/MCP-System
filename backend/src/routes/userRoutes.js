import express from "express";
import {
  getAllUsers,
  addPartner,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Get all users (Admins/MCPs)
router.get("/", protect, getAllUsers);

// 📌 Add a new pickup partner
router.post("/partner", protect, addPartner);

// 📌 Update user details by ID
router.put("/:id", protect, updateUser);

// 📌 Delete user by ID
router.delete("/:id", protect, deleteUser);

export default router;
