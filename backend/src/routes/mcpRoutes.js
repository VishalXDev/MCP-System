import express from "express";
import { protect, isMCP } from "../middleware/authMiddleware.js";
import { getReports } from "../controllers/reportsController.js";
import {
  addPickupPartner,
  removePickupPartner,
  assignOrder,
  getAllOrders,
  addFundsToWallet,
  getAllPickupPartners,
} from "../controllers/mcpController.js";

const router = express.Router();

/**
 * @section Pickup Partner Management
 */
router.post("/add-partner", protect, isMCP, addPickupPartner); // ➕ Add new partner
router.delete("/remove-partner/:partnerId", protect, isMCP, removePickupPartner); // ❌ Remove partner
router.get("/partners", protect, isMCP, getAllPickupPartners); // 📋 Get all partners

/**
 * @section Order Management
 */
router.post("/assign-order", protect, isMCP, assignOrder); // ✅ Assign order to partner
router.get("/orders", protect, isMCP, getAllOrders); // 📦 Get all orders (admin view)

/**
 * @section Wallet Management
 */
router.post("/add-funds", protect, isMCP, addFundsToWallet); // 💰 Add funds to a partner's wallet

/**
 * @section Reports
 */
router.get("/reports", protect, isMCP, getReports); // 📊 Get analytics/reports

export default router;
