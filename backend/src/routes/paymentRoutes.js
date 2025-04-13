import express from "express";
import {
  createOrder,
  razorpayWebhookHandler,
  verifyPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Create a Razorpay payment order
router.post("/create-order", protect, createOrder);

// 📌 Verify Razorpay payment (after frontend checkout success)
router.post("/verify-payment", protect, verifyPayment);

// 📌 Razorpay Webhook Listener (DO NOT protect this route)
router.post("/razorpay-webhook", express.raw({ type: "application/json" }), razorpayWebhookHandler);

export default router;
