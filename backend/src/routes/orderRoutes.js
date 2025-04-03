const { sendNotification } = require("../socket.js");
import express from "express";
import { check, validationResult } from "express-validator";
import {
  createOrder,
  updateOrderStatus,
  getOrderDetails,
  trackOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import { getSocketIO } from "../socket.io/index.js";

const router = express.Router();

// 📌 Route to create an order (with validation)
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

// 📌 Route to update order status
router.put("/update-status", protect, updateOrderStatus);

// 📌 Route to get order details
router.get("/:orderId", protect, getOrderDetails);

// 📌 Route to track an order
router.get("/track/:orderId", protect, trackOrder);

// 📌 Route to fetch all orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Route to update order location
router.put("/updateLocation/:orderId", protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Validate latitude and longitude
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ message: "Invalid location data" });
    }

    // Find and update the order with new location
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { latitude, longitude },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    router.put("/:orderId/status", authMiddleware, async (req, res) => {
      try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });
    
        order.status = status;
        await order.save();
    
        // Send notification to the assigned pickup partner
        sendNotification(order.pickupPartnerId, `Order ${order._id} status updated to ${status}`);
    
        res.json({ message: "Order status updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
      }
    });
    
    // Emit the updated location to the assigned partner via Socket.IO
    if (order.assignedTo) {
      getSocketIO()
        .to(`partner_${order.assignedTo._id}`)
        .emit("orderLocationUpdated", {
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
