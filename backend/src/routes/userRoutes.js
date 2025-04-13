import express from "express";
import {
  getAllUsers,
  addPartner,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  addPickupPartner
} from "../controllers/pickupPartnerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { validate, validateAddPartner } from '../middleware/validators.js';

const router = express.Router();

// 📌 Get all users (Admins/MCPs)
router.get("/", protect, getAllUsers);

// 📌 Add a new pickup partner (basic partner from userController)
router.post("/partner", protect, addPartner);

// 📌 Add a new pickup partner (with validation, handled by pickupPartnerController)
router.post("/add-partner", protect, validate(validateAddPartner), addPickupPartner);

// 📌 Update user details by ID
router.put("/:id", protect, updateUser);

// 📌 Delete user by ID
router.delete("/:id", protect, deleteUser);

export default router;
