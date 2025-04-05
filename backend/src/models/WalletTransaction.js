import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { 
      type: String, 
      enum: ["credit", "debit"], 
      required: true 
    }, // Credit = Add money, Debit = Deduct money
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed"], 
      default: "pending" 
    }
  },
  { timestamps: true }
);

const WalletTransaction = mongoose.model("WalletTransaction", WalletTransactionSchema);
export default WalletTransaction;
