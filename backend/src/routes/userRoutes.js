import express from "express";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id", protect, updateUser); // Update user
router.delete("/:id", protect, deleteUser); // Delete user

export default router;
