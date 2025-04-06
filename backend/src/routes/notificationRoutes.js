import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  getNotifications, 
  markAsRead 
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the logged-in user
 * @access  Protected
 */
router.get("/", protect, getNotifications);

/**
 * @route   PATCH /api/notifications/:notificationId
 * @desc    Mark a specific notification as read
 * @access  Protected
 */
router.patch("/:notificationId", protect, markAsRead);

export default router;
