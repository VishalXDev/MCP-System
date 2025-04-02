import express from "express";
import { protect, isMCP } from "../middleware/authMiddleware.js";
import { getReports } from "../controllers/reportsController.js";
import {
  addPickupPartner,
  removePickupPartner,
  assignOrder,
  getAllOrders,
  addFundsToWallet,
  getAllPickupPartners  // Ensure this is correctly exported from mcpController.js
} from "../controllers/mcpController.js";

const router = express.Router();

// 📌 Pickup Partner Management
router.post("/add-partner", protect, isMCP, addPickupPartner);
router.delete("/remove-partner/:partnerId", protect, isMCP, removePickupPartner);
router.get("/partners", protect, isMCP, getAllPickupPartners);  // Route for getting all partners

// 📌 Order Management
router.post("/assign-order", protect, isMCP, assignOrder);
router.get("/orders", protect, isMCP, getAllOrders);

// 📌 Wallet Management
router.post("/add-funds", protect, isMCP, addFundsToWallet);

// 📌 Reports
router.get("/reports", protect, isMCP, getReports);

export default router;
