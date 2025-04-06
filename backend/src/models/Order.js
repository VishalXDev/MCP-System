import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],

    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },

    location: String,

    geo: {
      lat: { type: Number },
      lng: { type: Number },
    },

    weight: { type: Number, required: true },
    earnings: { type: Number, required: true },

    isCancelled: { type: Boolean, default: false },
    cancellationReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Add pre-save hook to track status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
