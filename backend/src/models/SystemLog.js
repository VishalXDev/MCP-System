import mongoose from "mongoose";

const systemLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g., "Order Created", "Payment Failed"
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: Object }, // Extra details about the event
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("SystemLog", systemLogSchema);
