const Order = require("../models/Order");
const PickupPartner = require("../models/PickupPartner");

const autoAssignOrder = async (orderId) => {
  // Find active, least busy pickup partner
  const partner = await PickupPartner.findOne({ isActive: true })
    .sort({ assignedOrders: 1 });

  if (!partner) throw new Error("No available pickup partner");

  // Assign order to that partner
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { assignedPartner: partner._id },
    { new: true }
  );

  // Add this order to the partner's list
  partner.assignedOrders.push(updatedOrder._id);
  await partner.save();

  return updatedOrder;
};

module.exports = autoAssignOrder;
