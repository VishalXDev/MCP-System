import express from "express";
import {
  createOrder,
  updateOrderStatus,
  getOrderDetails,
  trackOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import { getSocketIO } from "../socket.io/index.js"; // Ensure io is properly initialized
const router = express.Router();

// Route to create an order
router.post("/create", protect, createOrder);

// Route to update order status
router.put("/update-status", protect, updateOrderStatus);

// Route to get order details
router.get("/:orderId", protect, getOrderDetails);

// Route to track an order
router.get("/track/:orderId", protect, trackOrder);

// Route to update order location
router.put("/updateLocation/:orderId", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Validate latitude and longitude before updating
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

    // Emit the updated location to the specific partner via Socket.IO
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
    res.status(400).json({ message: "Error updating order location", error: error.message });
  }
});

export default router;
