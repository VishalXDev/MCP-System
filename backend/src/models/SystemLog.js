import mongoose from "mongoose";

const systemLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    }, // e.g., "Order Created", "Login Attempt", "Wallet Updated"

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // You could also accept "PickupPartner" and use `refPath` if needed
      required: false,
    },

    role: {
      type: String,
      enum: ["MCP", "PickupPartner", "System"],
      default: "System",
    }, // Helpful to track what kind of user triggered the action

    details: {
      method: String,
      path: String,
      body: Object,
      params: Object,
      query: Object,
    },

    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
    }, // Optional: helps identify failed attempts

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SystemLog", systemLogSchema);
