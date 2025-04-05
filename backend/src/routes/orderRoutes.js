import express from "express";
import { check } from "express-validator";
import {
  createOrder,
  updateOrderStatus,
  getOrderDetails,
  trackOrder,
  getOrders,
  assignOrder,
  updateStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import { getSocketIO } from "../socket.io/index.js";
import { sendNotification } from "../socket.js";

const router = express.Router();

// 📌 Create Order
router.post(
  "/",
  protect,
  [
    check("productId").notEmpty().withMessage("Product ID is required"),
    check("quantity").isInt({ gt: 0 }).withMessage("Quantity must be positive"),
  ],
  createOrder
);

// 📌 Update order status
router.put("/update-status", protect, updateOrderStatus);

// 📌 Get order details
router.get("/:orderId", protect, getOrderDetails);

// 📌 Track order
router.get("/track/:orderId", protect, trackOrder);

// 📌 Get all orders
router.get("/", protect, getOrders);

// 📌 Assign order to partner
router.put("/:id/assign", protect, assignOrder);

// 📌 Update order status (by ID)
router.put("/:id/status", protect, updateStatus);

// 📌 Update order location
router.put("/updateLocation/:orderId", protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ message: "Invalid location data" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { latitude, longitude },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.assignedTo) {
      const partnerId = order.assignedTo._id?.toString() || order.assignedTo;
      getSocketIO().to(`partner_${partnerId}`).emit("orderLocationUpdated", {
        orderId: order._id,
        latitude,
        longitude,
      });

      sendNotification(partnerId, {
        type: "locationUpdate",
        orderId: order._id,
        latitude,
        longitude,
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({
      message: "Error updating order location",
      error: error.message,
    });
  }
});
import { getOrderStats } from "../controllers/orderController.js";
router.get("/stats", getOrderStats);

export default router;
