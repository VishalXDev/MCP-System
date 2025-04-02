import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";
import { getSocketIO } from "../socket.io/index.js";
import Notification from "../models/Notification.js";

// 📌 Update Order Status & Process Payment
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate status
    const validStatuses = ["In Progress", "Completed", "Pending", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    // Find the order
    const order = await Order.findById(orderId).populate("assignedTo", "_id");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Validate if the current user is authorized to update the order
    if (!order.assignedTo || order.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    // Update order status
    order.status = status;

    // Process payment and wallet update if order is completed
    if (status === "Completed") {
      const partner = await PickupPartner.findById(order.assignedTo._id);
      if (partner) {
        const earnings = order.earnings || 0;
        partner.walletBalance += earnings;
        partner.transactions = partner.transactions || [];
        partner.transactions.push({
          amount: earnings,
          type: "credit",
          description: `Payment for Order ${order.orderId}`,
        });
        await partner.save();
      }
    }

    // Save order status update
    await order.save();

    // Create notification for partner
    await Notification.create({
      userId: order.assignedTo._id,
      title: "Order Status Updated",
      message: `Order ${order.orderId} status changed to ${status}`,
      type: "order",
    });

    // Emit real-time notification via Socket.IO
    getSocketIO().to(`partner_${order.assignedTo._id}`).emit("orderStatusUpdate", {
      orderId,
      status,
      message: `Order ${orderId} is now ${status}`,
    });

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// 📌 Get Wallet Details
export const getWalletDetails = async (req, res) => {
  try {
    const partner = await PickupPartner.findById(req.user._id);
    if (!partner) return res.status(404).json({ message: "Pickup Partner not found" });

    res.status(200).json({
      walletBalance: partner.walletBalance,
      transactions: partner.transactions || [], // Default to empty array if undefined
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet details", error: error.message });
  }
};

// 📌 Assign Order and Notify Partner
export const assignOrder = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, weight, earnings, partnerId } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropoffLocation || !weight || !earnings || !partnerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const partner = await PickupPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Pickup Partner not found" });

    const orderId = `ORD-${Date.now()}`;
    const newOrder = await Order.create({
      orderId,
      pickupLocation,
      dropoffLocation,
      weight,
      earnings,
      assignedTo: partnerId,
      status: "Pending",
    });

    partner.assignedOrders.push(newOrder._id);
    await partner.save();

    // Emit real-time notification to partner
    getSocketIO().to(`partner_${partnerId}`).emit("newOrder", {
      message: "You have a new order assigned!",
      order: newOrder,
    });

    res.status(201).json({ message: "Order assigned successfully!", newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error assigning order", error: error.message });
  }
};

// 📌 Get Order Details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ orderId }).populate("assignedTo", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details", error: error.message });
  }
};

// 📌 Create a New Order
export const createOrder = async (req, res) => {
  try {
    const { partnerId, userId, totalAmount, orderDetails } = req.body;

    if (!partnerId || !userId || !orderDetails || typeof totalAmount !== "number") {
      return res.status(400).json({ message: "Invalid or missing required fields" });
    }

    const newOrder = new Order({
      partnerId,
      userId,
      totalAmount,
      orderDetails,
      status: "pending", // Default status
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// 📌 Track an Order
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).populate("assignedTo", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({
      orderId,
      status: order.status,
      pickupLocation: order.pickupLocation,
      dropoffLocation: order.dropoffLocation,
    });
  } catch (error) {
    res.status(500).json({ message: "Error tracking order", error: error.message });
  }
};

// Make sure all functions are exported
export {
  // createOrder,
  // updateOrderStatus,
  // trackOrder,
  // getOrderDetails,
  // assignOrder,
  // getWalletDetails,
};
