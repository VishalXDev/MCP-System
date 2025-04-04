import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: function() { return this.type === "Debit"; } 
    },
    receiver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: function() { return this.type === "Credit"; }
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }, // Simplified alternative
    amount: { 
      type: Number, 
      required: true,
      min: 0.01 // Ensure positive amount
    },
    type: { 
      type: String, 
      enum: ["Credit", "Debit", "System"], // Added system type
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
      ] 
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Add indexes for better query performance
transactionSchema.index({ sender: 1 });
transactionSchema.index({ receiver: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ createdAt: -1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return `${this.type === 'Credit' ? '+' : '-'}${this.amount.toFixed(2)}`;
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;