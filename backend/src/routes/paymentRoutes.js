import express from "express";
import {
  createOrder,
  razorpayWebhookHandler,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, createOrder);

// Verify payment and update wallet
router.post("/verify-payment", protect, verifyPayment); // verifyPayment should be imported from controller

// Razorpay webhook (ensure webhook secret verification inside controller)
router.post("/razorpay-webhook", razorpayWebhookHandler);

export default router;
