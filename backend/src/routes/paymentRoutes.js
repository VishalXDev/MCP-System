import express from "express";
import {
  createOrder,
  razorpayWebhookHandler,
  verifyPayment, // ✅ Only import once
} from "../controllers/paymentController.js"; // ✅ Import Fix
import { protect } from "../middleware/authMiddleware.js";
import razorpay from "../config/razorpay.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, createOrder);

// Verify payment and update wallet
router.post("/verify-payment", protect, verifyPayment);

// Razorpay webhook (ensure webhook secret verification inside controller)
router.post("/razorpay-webhook", razorpayWebhookHandler);

export default router;
