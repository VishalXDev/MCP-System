import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Unique Order ID
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PickupPartner",
      default: null,
    }, // Assigned Partner
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    weight: { type: Number, required: true }, // Weight of waste in KG
    earnings: { type: Number, required: true }, // Payment for the partner
    latitude: { type: Number, required: true }, // Latitude for location tracking
    longitude: { type: Number, required: true }, // Longitude for location tracking
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
