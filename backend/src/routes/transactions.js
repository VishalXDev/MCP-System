import express from "express";
import {
  getTransactions,
  addTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getTransactions);
router.post("/", protect, addTransaction);

export default router;
