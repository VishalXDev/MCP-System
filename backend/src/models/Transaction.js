import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: function () { return this.type === "Debit"; } 
    },
    receiver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: function () { return this.type === "Credit"; }
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }, // Simplified reference for the affected user
    amount: { 
      type: Number, 
      required: true,
      min: 0.01 
    },
    type: { 
      type: String, 
      enum: ["Credit", "Debit", "System"], 
      required: true 
    },
    description: { 
      type: String,
      enum: [
        "Order Completion",
        "Wallet Topup",
        "Commission",
        "Penalty",
        "System Adjustment"
      ],
      default: "System Adjustment"
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 📌 Indexes for faster queries
transactionSchema.index({ sender: 1 });
transactionSchema.index({ receiver: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ createdAt: -1 });

// 📌 Virtual: formatted amount with +/-
transactionSchema.virtual("formattedAmount").get(function () {
  return `${this.type === "Credit" ? "+" : "-"}${this.amount.toFixed(2)}`;
});

// 📌 Virtual: direction of transaction
transactionSchema.virtual("direction").get(function () {
  if (this.sender && this.receiver) return "transfer";
  if (this.sender) return "debit";
  if (this.receiver) return "credit";
  return "system";
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
