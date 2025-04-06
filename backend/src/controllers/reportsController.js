import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";

// 📌 Generate Reports & Analytics (Admin Panel)
export const getReports = async (req, res) => {
  try {
    // 🔹 Order Stats
    const [totalOrders, completedOrders, pendingOrders, failedOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "Completed" }),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Failed" }),
    ]);

    // 🔹 Total Earnings
    const earningsAgg = await Order.aggregate([
      { $group: { _id: null, totalEarnings: { $sum: "$earnings" } } },
    ]);
    const totalEarnings = earningsAgg.length > 0 ? earningsAgg[0].totalEarnings : 0;

    // 🔹 Partner Performance
    const partnerPerformance = await PickupPartner.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "assignedTo",
          as: "orders",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          totalOrders: { $size: "$orders" },
          completedOrders: {
            $size: {
              $filter: {
                input: "$orders",
                as: "order",
                cond: { $eq: ["$$order.status", "Completed"] },
              },
            },
          },
        },
      },
    ]);

    // ✅ Response
    res.status(200).json({
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        failedOrders,
        totalEarnings,
      },
      partnerPerformance,
    });
  } catch (error) {
    console.error("❌ Error generating reports:", error);
    res.status(500).json({
      message: "Failed to generate reports",
      error: error.message,
    });
  }
};
