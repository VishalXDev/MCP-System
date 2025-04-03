import express from "express";
import { protect, isMCP } from "../middleware/authMiddleware.js";
import { getReports } from "../controllers/reportsController.js";
import {
  addPickupPartner,
  removePickupPartner,
  assignOrder,
  getAllOrders,
  addFundsToWallet,
  getAllPickupPartners
} from "../controllers/mcpController.js";

const router = express.Router();

// Ensure all route handlers are correctly defined and exported in mcpController.js

// 📌 Pickup Partner Management
router.post("/add-partner", protect, isMCP, addPickupPartner);
router.delete("/remove-partner/:partnerId", protect, isMCP, removePickupPartner);
router.get("/partners", protect, isMCP, getAllPickupPartners);

// 📌 Order Management
router.post("/assign-order", protect, isMCP, assignOrder);
router.get("/orders", protect, isMCP, getAllOrders);

// 📌 Wallet Management
router.post("/add-funds", protect, isMCP, addFundsToWallet);

// 📌 Reports
router.get("/reports", protect, isMCP, getReports);

export default router;