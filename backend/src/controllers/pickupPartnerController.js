import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";

// 📌 Update Order Status & Process Payment
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["In Progress", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findById(orderId).populate("assignedTo");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.assignedTo) {
      return res.status(400).json({ message: "Order is not assigned to any partner" });
    }

    // Ensure the logged-in partner is authorized
    if (order.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    order.status = status;

    // If Completed, credit earnings to partner wallet
    if (status === "Completed") {
      const partner = await PickupPartner.findById(order.assignedTo._id);
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
      }
    }

    await order.save();

    res.status(200).json({
      message: `Order status updated to '${status}' successfully`,
      order,
    });
  } catch (error) {
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
    res.status(500).json({ message: `Error fetching wallet details: ${error.message}` });
  }
};
// Get partner performance (completed orders count)
export const getPartnerPerformance = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$assignedTo",
          completedOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users", // or 'partners' depending on your schema
          localField: "_id",
          foreignField: "_id",
          as: "partnerInfo",
        },
      },
      {
        $unwind: "$partnerInfo",
      },
      {
        $project: {
          partner: "$partnerInfo.name",
          completedOrders: 1,
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch partner performance", error: err.message });
  }
};
