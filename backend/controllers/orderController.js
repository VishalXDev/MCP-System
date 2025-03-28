import Order from "../models/Order.js";

// Assign Order
export const assignOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Orders
export const getOrders = async (req, res) => {
  const orders = await Order.find().populate("pickupPartner");
  res.json(orders);
};
