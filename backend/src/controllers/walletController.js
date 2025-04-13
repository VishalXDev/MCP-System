import { io } from "../server.js"; // Socket.IO instance
import PickupPartner from "../models/PickupPartner.js";
import Notification from "../models/Notification.js";
import { addFundsToWallet as addFundsService } from "../services/walletService.js";

// 📌 Admin: Add funds to pickup partner's wallet
export const addFundsToWallet = async (req, res) => {
  try {
    const { partnerId, amount } = req.body;

    if (!partnerId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid partner ID or amount" });
    }

    const partner = await PickupPartner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ success: false, message: "Pickup Partner not found" });
    }

    // Update wallet balance and log transaction
    partner.walletBalance += amount;
    partner.transactions.push({
      amount,
      type: "credit",
      description: "Funds added by MCP",
      date: new Date(),
    });

    await partner.save();

    const balance = partner.walletBalance;

    // Store notification
    await Notification.create({
      userId: partnerId,
      title: "Wallet Credited",
      message: `₹${amount} added to your wallet. New balance: ₹${balance}`,
      type: "wallet",
    });

    // Emit real-time update to connected socket
    io.to(`partner_${partnerId}`).emit("walletUpdate", {
      message: `Funds added! New Balance: ₹${balance}`,
      balance,
    });

    res.status(200).json({
      success: true,
      message: "Funds added successfully",
      walletBalance: balance,
    });
  } catch (error) {
    console.error("💥 Error adding funds:", error);
    res.status(500).json({
      success: false,
      message: "Error adding funds",
      error: error.message,
    });
  }
};

// 📌 Partner: Add funds to their own wallet via Razorpay or service logic
export const handleWalletFunding = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized request" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const response = await addFundsService(req.user.id, amount);

    res.status(200).json({
      success: true,
      message: "Wallet funded successfully",
      ...response,
    });
  } catch (error) {
    console.error("💥 Wallet funding error:", error);
    res.status(500).json({
      success: false,
      message: "Wallet funding failed",
      error: error.message,
    });
  }
};
