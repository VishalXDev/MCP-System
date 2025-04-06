import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    pickupPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PickupPartner"
    },
    amount: { 
      type: Number, 
      required: true,
      min: [0.01, "Amount must be positive"]
    },
    type: { 
      type: String, 
      enum: ["credit", "debit"], 
      required: true 
    }, // credit = add, debit = deduct
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed"], 
      default: "pending" 
    },
    method: {
      type: String,
      enum: ["razorpay", "manual", "system"],
      default: "manual"
    },
    description: {
      type: String,
      default: ""
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ✅ Virtual for quick success check
WalletTransactionSchema.virtual("isSuccessful").get(function () {
  return this.status === "completed";
});

// ✅ Indexes for fast query performance
WalletTransactionSchema.index({ userId: 1 });
WalletTransactionSchema.index({ pickupPartnerId: 1 });
WalletTransactionSchema.index({ createdAt: -1 });

const WalletTransaction = mongoose.model("WalletTransaction", WalletTransactionSchema);
export default WalletTransaction;
