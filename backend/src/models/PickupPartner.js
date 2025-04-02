import mongoose from "mongoose";

// ✅ Define a separate schema for transactions
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Define the PickupPartner schema
const pickupPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Orders assigned
    walletBalance: { type: Number, default: 0 }, // Wallet balance in INR
    role: { type: String, default: "PickupPartner" }, // Fixed role
    transactions: [transactionSchema], // Use the transaction schema
  },
  { timestamps: true }
);

// ✅ Create the model
const PickupPartner = mongoose.model("PickupPartner", pickupPartnerSchema);

export default PickupPartner;
