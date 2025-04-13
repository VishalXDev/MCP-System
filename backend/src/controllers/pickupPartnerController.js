import bcrypt from "bcryptjs";
import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";
import { getSocketIO } from "../socket.io/index.js";

// 📌 Add New Pickup Partner (Admin only)
const addPickupPartner = async (req, res) => {
  try {
    const { name, email, phone, password, commission } = req.body;

    const existing = await PickupPartner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Partner with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    const newPartner = new PickupPartner({
      name,
      email,
      phone,
      password: hashedPassword,
      commission: commission || 10,
      walletBalance: 0,
      transactions: [],
    });

    await newPartner.save();

    res.status(201).json({
      message: "Pickup partner added successfully",
      partner: {
        id: newPartner._id,
        name: newPartner.name,
        email: newPartner.email,
        phone: newPartner.phone,
      },
    });
  } catch (error) {
    console.error("Error in addPickupPartner:", error);
    res.status(500).json({ message: `Failed to add pickup partner: ${error.message}` });
  }
};

// 📌 Update Order Status & Credit Earnings to Wallet
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["In Progress", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findById(orderId).populate("assignedTo");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.assignedTo) {
      return res.status(400).json({ message: "Order is not assigned to any partner" });
    }

    if (order.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    order.status = status;

    if (status === "Completed") {
      const partner = await PickupPartner.findById(req.user._id);
      if (partner) {
        const earnings = order.earnings || 0;
        partner.walletBalance += earnings;

        partner.transactions.push({
          amount: earnings,
          type: "credit",
          description: `Earnings for Order ${order._id}`,
          date: new Date(),
        });

        await partner.save();

        // 🔔 Notify partner about credited earnings
        getSocketIO().to(`partner_${partner._id}`).emit("walletUpdated", {
          message: `₹${earnings} credited for Order #${order._id}`,
          balance: partner.walletBalance,
        });
      }
    }

    await order.save();

    res.status(200).json({
      message: `Order status updated to '${status}' successfully`,
      order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: `Error updating order status: ${error.message}` });
  }
};

// 📌 Get Wallet Details
const getWalletDetails = async (req, res) => {
  try {
    const partner = await PickupPartner.findById(req.user._id);
    if (!partner) {
      return res.status(404).json({ message: "Pickup Partner not found" });
    }

    res.status(200).json({
      walletBalance: partner.walletBalance,
      transactions: partner.transactions || [],
    });
  } catch (error) {
    console.error("Error in getWalletDetails:", error);
    res.status(500).json({ message: `Error fetching wallet details: ${error.message}` });
  }
};

// 📌 Get Pickup Partner Performance (Completed Orders Count)
const getPartnerPerformance = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: "$assignedTo",
          completedOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "pickuppartners",
          localField: "_id",
          foreignField: "_id",
          as: "partnerInfo",
        },
      },
      { $unwind: "$partnerInfo" },
      {
        $project: {
          partner: "$partnerInfo.name",
          completedOrders: 1,
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error in getPartnerPerformance:", error);
    res.status(500).json({
      message: "Failed to fetch partner performance",
      error: error.message,
    });
  }
};

// ✅ Export all functions
export {
  addPickupPartner,
  updateOrderStatus,
  getWalletDetails,
  getPartnerPerformance,
};
