import express from "express";
import WalletTransaction from "../models/WalletTransaction.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🏦 Get wallet balance
router.get("/balance", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await WalletTransaction.find({ userId, status: "completed" });

    const balance = transactions.reduce((sum, txn) =>
      txn.type === "credit" ? sum + txn.amount : sum - txn.amount, 0);

    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallet balance" });
  }
});

// 💰 Add money to wallet (Admin only)
router.post("/add-money", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { userId, amount } = req.body;
    const transaction = new WalletTransaction({
      userId,
      amount,
      type: "credit",
      status: "completed",
    });

    await transaction.save();
    res.json({ message: "Amount added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Transaction failed" });
  }
});

// 📤 Request payout (Pickup Partner only)
router.post("/request-payout", protect, async (req, res) => {
  try {
    if (req.user.role !== "pickupPartner") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { amount } = req.body;
    const transaction = new WalletTransaction({
      userId: req.user.id,
      amount,
      type: "debit",
      status: "pending",
    });

    await transaction.save();
    res.json({ message: "Payout request submitted" });
  } catch (error) {
    res.status(500).json({ error: "Request failed" });
  }
});

// ✅ Approve payout (Admin only)
router.post("/approve-payout/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const transaction = await WalletTransaction.findById(req.params.id);
    if (!transaction || transaction.type !== "debit" || transaction.status !== "pending") {
      return res.status(400).json({ error: "Invalid payout request" });
    }

    transaction.status = "completed";
    await transaction.save();

    res.json({ message: "Payout approved" });
  } catch (error) {
    res.status(500).json({ error: "Approval failed" });
  }
});

export default router;
