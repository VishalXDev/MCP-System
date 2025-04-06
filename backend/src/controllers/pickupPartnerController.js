import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";
import { getSocketIO } from "../socket.io/index.js";

// 📌 Update Order Status & Credit Earnings to Wallet
export const updateOrderStatus = async (req, res) => {
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
export const getWalletDetails = async (req, res) => {
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
export const getPartnerPerformance = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: "Completed" } }, // ensure case matches stored value
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
