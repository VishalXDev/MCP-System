import PickupPartner from "../models/PickupPartner.js";
import Notification from "../models/Notification.js";

/**
 * Add funds to a pickup partner's wallet and notify them.
 * @param {string} partnerId - The ID of the pickup partner.
 * @param {number} amount - The amount to credit.
 * @returns {object} - Result with message and new wallet balance.
 */
export const addFundsToWallet = async (partnerId, amount) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const partner = await PickupPartner.findById(partnerId);
    if (!partner) {
      throw new Error("Pickup Partner not found");
    }

    // Update wallet
    partner.walletBalance += amount;
    partner.transactions.push({
      amount,
      type: "credit",
      description: "Funds added by MCP",
    });

    await partner.save();

    // Notify the partner
    await Notification.create({
      userId: partnerId,
      title: "Wallet Updated",
      message: `₹${amount} added to your wallet. New balance: ₹${partner.walletBalance}`,
      type: "wallet",
    });

    return {
      message: "Funds added successfully!",
      walletBalance: partner.walletBalance,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
