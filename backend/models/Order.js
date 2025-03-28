import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  pickupPartner: { type: mongoose.Schema.Types.ObjectId, ref: "PickupPartner" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
});

export default mongoose.model("Order", OrderSchema);
