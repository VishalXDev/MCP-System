import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // MCP or system
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Pickup Partner
    amount: { type: Number, required: true },
    type: { type: String, enum: ["Credit", "Debit"], required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
