import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";

// 📌 Generate Reports & Analytics
export const getReports = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "Completed" });
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const failedOrders = await Order.countDocuments({ status: "Failed" });

    const totalEarnings = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$earnings" } } },
    ]);

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

    res.status(200).json({
      totalOrders,
      completedOrders,
      pendingOrders,
      failedOrders,
      totalEarnings: totalEarnings[0]?.total || 0,
      partnerPerformance,
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    res.status(500).json({ message: "Error generating reports", error: error.message });
  }
};
