import express from "express";
import { protect, isPickupPartner } from "../middleware/authMiddleware.js";
import {
  updateOrderStatus,
  getWalletDetails,
  getPartnerPerformance
} from "../controllers/pickupPartnerController.js";

const router = express.Router();

// 📌 Accept Order (Sample Placeholder Endpoint)
router.post("/accept-order", protect, isPickupPartner, (req, res) => {
  res.json({ message: "Order accepted!" });
});

// 📌 Update Order Status
router.put("/update-order/:orderId", protect, isPickupPartner, updateOrderStatus);

// 📌 Wallet Details
router.get("/wallet", protect, isPickupPartner, getWalletDetails);

// 📌 Partner Performance Analytics
router.get("/performance", protect, isPickupPartner, getPartnerPerformance);

export default router;
