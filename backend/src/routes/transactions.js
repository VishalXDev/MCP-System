import express from "express";
import {
  getTransactions,
  addTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Get all wallet transactions for a user
router.get("/:userId", protect, getTransactions);

// 📌 Add a new wallet transaction (used by admin or payout system)
router.post("/", protect, addTransaction);

export default router;
