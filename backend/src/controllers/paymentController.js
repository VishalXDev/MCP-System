import Razorpay from "razorpay";
import crypto from "crypto";
import PickupPartner from "../models/PickupPartner.js";
import User from "../models/user.js";
import Transaction from "../models/Transaction.js";
import { getSocketIO } from "../socket.io/index.js";
import razorpayInstance from "../config/razorpay.js";

// 📌 Add Funds to Wallet (Admin manually adds to Pickup Partner)
export const addFundsToWallet = async (req, res) => {
  try {
    const { partnerId, amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const partner = await PickupPartner.findById(partnerId);
    if (!partner)
      return res.status(404).json({ message: "Pickup Partner not found" });

    partner.walletBalance += amount;
    partner.transactions.push({
      amount,
      type: "credit",
      description: "Funds added by MCP",
    });

    await partner.save();

    // 💾 Log transaction to DB
    await Transaction.create({
      userId: partnerId,
      amount,
      type: "credit",
      description: "Funds added by MCP",
      status: "Paid",
    });

    // 🔔 Emit real-time notification
    getSocketIO().to(`partner_${partnerId}`).emit("walletUpdated", {
      message: `Your wallet has been credited with ₹${amount}`,
      balance: partner.walletBalance,
    });

    res.status(200).json({
      message: "Funds added successfully!",
      walletBalance: partner.walletBalance,
    });
  } catch (error) {
    console.error("Error in addFundsToWallet:", error);
    res.status(500).json({ message: "Error adding funds", error: error.message });
  }
};

// 📌 Verify Payment & Update User Wallet
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update User Wallet
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletBalance += amount;
    user.transactions.push({
      amount,
      type: "credit",
      description: "Wallet top-up via Razorpay",
      date: new Date(),
    });

    await user.save();

    // 💾 Log transaction
    await Transaction.create({
      userId,
      amount,
      type: "credit",
      description: "Wallet top-up via Razorpay",
      razorpayOrderId: razorpay_order_id,
      status: "Paid",
    });

    res.json({
      message: "Payment successful, wallet updated",
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ message: "Verification Error", error: error.message });
  }
};

// 📌 Razorpay Webhook for Payment Capture
export const razorpayWebhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const { event, payload } = req.body;

    if (event === "payment.captured") {
      const { order_id } = payload.payment.entity;

      const order = await Transaction.findOne({ razorpayOrderId: order_id });
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.status === "Paid") {
        return res.status(200).send("Already processed");
      }

      order.status = "Paid";
      await order.save();

      getSocketIO()
        .to(`user_${order.userId}`)
        .emit("paymentCaptured", {
          message: `Your payment for order #${order_id} was successfully captured.`,
          orderId: order._id,
          status: order.status,
        });

      res.status(200).send("Webhook received");
    } else {
      res.status(200).send("Unhandled event");
    }
  } catch (error) {
    console.error("Error in razorpayWebhookHandler:", error);
    res.status(500).json({ message: "Webhook error", error });
  }
};

// 📌 Create Razorpay Order (Frontend will use this before Razorpay Checkout)
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency,
      receipt: receipt || `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({
      message: "Razorpay order created",
      order,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
  }
};
