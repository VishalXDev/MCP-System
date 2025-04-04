import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Changed to "User" to match your second schema
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "in_progress"], // Combined statuses
      default: "pending",
    },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    location: String, // Keeping your simpler location field as fallback
    weight: { type: Number, required: true },
    earnings: { type: Number, required: true },
    latitude: { type: Number }, // Made optional since you have location string
    longitude: { type: Number }, // Made optional
  },
  { timestamps: true } // This handles createdAt automatically
);

const Order = mongoose.model("Order", orderSchema);
export default Order;