import express from "express";
import { 
  createOrder, 
  razorpayWebhookHandler, 
  verifyPayment 
} from "../controllers/paymentController.js"; // ✅ Import Fix
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, createOrder);

// Verify payment and update wallet
router.post("/verify-payment", protect, verifyPayment);

// Razorpay webhook (ensure webhook secret verification inside controller)
router.post("/razorpay-webhook", razorpayWebhookHandler);

export default router;
