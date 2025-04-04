import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";
import { getSocketIO } from "../socket.io/index.js";
import Notification from "../models/Notification.js";

// 📌 Create a New Order
export const createOrder = async (req, res) => {
  try {
    const { partnerId, userId, totalAmount, orderDetails, location } = req.body;

    if (!location && (!partnerId || !userId || !orderDetails || typeof totalAmount !== "number")) {
      return res.status(400).json({ message: "Invalid or missing required fields" });
    }

    const order = await Order.create({
      partnerId,
      userId,
      totalAmount,
      orderDetails,
      location,
      status: "pending",
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// 📌 Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("assignedTo", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Assign an Order to a Partner
export const assignOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { partnerId } = req.body;

    const partner = await PickupPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Pickup Partner not found" });

    const order = await Order.findByIdAndUpdate(
      id,
      { assignedTo: partnerId, status: "Pending" },
      { new: true }
    );

    partner.assignedOrders.push(order._id);
    await partner.save();

    getSocketIO().to(`partner_${partnerId}`).emit("newOrder", {
      message: "You have a new order assigned!",
      order,
    });

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 Update Order Status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 Update Order Status with Authorization + Wallet Handling
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const validStatuses = ["In Progress", "Completed", "Pending", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findById(orderId).populate("assignedTo", "_id");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      !order.assignedTo ||
      order.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    order.status = status;

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

    await order.save();

    await Notification.create({
      userId: order.assignedTo._id,
      title: "Order Status Updated",
      message: `Order ${order.orderId} status changed to ${status}`,
      type: "order",
    });

    getSocketIO()
      .to(`partner_${order.assignedTo._id}`)
      .emit("orderStatusUpdate", {
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
      transactions: partner.transactions || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet details", error: error.message });
  }
};

// 📌 Get Order Details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ orderId }).populate(
      "assignedTo",
      "name email phone"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details", error: error.message });
  }
};

// 📌 Track an Order
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).populate(
      "assignedTo",
      "name email phone"
    );
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
