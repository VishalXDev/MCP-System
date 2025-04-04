import express from "express";
import { check, validationResult } from "express-validator";
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
import { getSocketIO } from "../socket.io/index.js"; // if you use this anywhere else
import { sendNotification } from "../socket.js"; // ✅ now properly exported from socket.js

const router = express.Router();

// 📌 Create an order with validation
router.post(
  "/",
  protect,
  [
    check("productId", "Product ID is required").not().isEmpty(),
    check("quantity", "Quantity should be a positive number").isInt({ gt: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    createOrder(req, res);
  }
);

// 📌 Update order status
router.put("/update-status", protect, updateOrderStatus);

// 📌 Get order details
router.get("/:orderId", protect, getOrderDetails);

// 📌 Track an order
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

    // ✅ Optional: notify partner with socket
    if (order.assignedTo) {
      const partnerId = order.assignedTo._id?.toString() || order.assignedTo;
      getSocketIO()
        .to(`partner_${partnerId}`)
        .emit("orderLocationUpdated", {
          orderId: order._id,
          latitude,
          longitude,
        });

      // Optionally also use sendNotification
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

export default router;
