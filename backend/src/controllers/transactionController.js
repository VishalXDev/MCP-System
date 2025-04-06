import Transaction from "../models/Transaction.js";
import PickupPartner from "../models/PickupPartner.js";
import { getSocketIO } from "../socket.io/index.js";

// 📌 Get all transactions for a pickup partner
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Add Money to Partner Wallet (Admin only)
export const addMoneyToWallet = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can add money" });
    }

    const { userId, amount, description } = req.body;

    const partner = await PickupPartner.findById(userId);
    if (!partner) return res.status(404).json({ error: "Partner not found" });

    partner.walletBalance += amount;

    partner.transactions.push({
      amount,
      type: "credit",
      description: description || "Admin credit",
      date: new Date(),
    });

    await partner.save();

    // Create separate Transaction model entry (optional)
    await Transaction.create({
      userId,
      amount,
      type: "credit",
      description: description || "Admin credit",
      date: new Date(),
    });

    getSocketIO().to(`partner_${partner._id}`).emit("walletUpdated", {
      message: `₹${amount} added to your wallet`,
      balance: partner.walletBalance,
    });

    res.status(200).json({ message: "Money added successfully", balance: partner.walletBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Request Payout (Pickup Partner)
export const requestPayout = async (req, res) => {
  try {
    const partner = await PickupPartner.findById(req.user._id);
    const { amount } = req.body;

    if (!partner) return res.status(404).json({ error: "Partner not found" });

    if (amount > partner.walletBalance) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    // For demo: just mark payout as pending (you can extend this)
    partner.walletBalance -= amount;

    partner.transactions.push({
      amount,
      type: "debit",
      description: "Payout Requested",
      date: new Date(),
    });

    await partner.save();

    await Transaction.create({
      userId: partner._id,
      amount,
      type: "debit",
      description: "Payout Requested",
      date: new Date(),
    });

    getSocketIO().to(`partner_${partner._id}`).emit("walletUpdated", {
      message: `₹${amount} requested for payout`,
      balance: partner.walletBalance,
    });

    res.status(200).json({ message: "Payout request submitted", balance: partner.walletBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Approve Payout (Admin only)
export const approvePayout = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can approve payouts" });
    }

    const { userId, amount } = req.body;

    const partner = await PickupPartner.findById(userId);
    if (!partner) return res.status(404).json({ error: "Partner not found" });

    // You can customize this logic based on payout status management
    partner.transactions.push({
      amount,
      type: "debit",
      description: "Payout Approved by Admin",
      date: new Date(),
    });

    await partner.save();

    await Transaction.create({
      userId,
      amount,
      type: "debit",
      description: "Payout Approved",
      date: new Date(),
    });

    getSocketIO().to(`partner_${partner._id}`).emit("walletUpdated", {
      message: `₹${amount} payout approved`,
      balance: partner.walletBalance,
    });

    res.status(200).json({ message: "Payout approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
