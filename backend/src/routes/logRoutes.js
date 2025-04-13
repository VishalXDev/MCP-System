import express from "express";
import { protect, isMCP } from "../middleware/authMiddleware.js";
import { getLogs } from "../controllers/logController.js";

const router = express.Router();

/**
 * @route   GET /api/logs
 * @desc    Get system logs (only accessible by MCP role)
 * @access  Private (MCP Only)
 */
router.get("/", protect, isMCP, getLogs);

export default router;
