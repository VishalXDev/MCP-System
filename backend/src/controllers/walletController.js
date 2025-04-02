import { io } from "../server.js"; // Import Socket.io instance
import PickupPartner from "../models/PickupPartner.js";
import Notification from "../models/Notification.js";
import { addFundsToWallet as addFundsService } from "../services/walletService.js";

export const addFundsToWallet = async (req, res) => {
  try {
    const { partnerId, amount } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const partner = await PickupPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Pickup Partner not found" });

    // Update Wallet Balance
    partner.walletBalance += amount;
    partner.transactions.push({
      amount,
      type: "credit",
      description: "Funds added by MCP",
    });

    await partner.save();

    // Save notification in DB
    await Notification.create({
      userId: partnerId,
      title: "Wallet Updated",
      message: `₹${amount} added to your wallet. New balance: ₹${partner.walletBalance}`,
      type: "wallet",
    });

    // Emit real-time notification
    io.to(`partner_${partnerId}`).emit("walletUpdate", {
      message: `Funds added! New Balance: ₹${partner.walletBalance}`,
      balance: partner.walletBalance,
    });

    res.status(200).json({ message: "Funds added successfully!", walletBalance: partner.walletBalance });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ message: "Error adding funds", error: error.message });
  }
};

export const handleWalletFunding = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }
    const response = await addFundsService(req.user.id, amount);
    res.status(200).json(response);
  } catch (error) {
    console.error("Wallet funding error:", error);
    res.status(500).json({ error: error.message });
  }
};
