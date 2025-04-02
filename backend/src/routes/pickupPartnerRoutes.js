import express from "express";
import { protect, isPickupPartner } from "../middleware/authMiddleware.js";
import { updateOrderStatus, getWalletDetails } from "../controllers/pickupPartnerController.js";

const router = express.Router();

// Example Pickup Partner Route: Accept Order
router.post("/accept-order", protect, isPickupPartner, (req, res) => {
  res.json({ message: "Order accepted!" });
});

// Pickup Partner Order Updates
router.put("/update-order/:orderId", protect, isPickupPartner, updateOrderStatus);

// Wallet Details
router.get("/wallet", protect, isPickupPartner, getWalletDetails);

export default router;
