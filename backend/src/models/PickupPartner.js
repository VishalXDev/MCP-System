import mongoose from "mongoose";

// ✅ Reusable embedded transaction schema
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Pickup Partner schema
const pickupPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profilePicture: { type: String, default: "" }, // Optional profile picture

    isActive: { type: Boolean, default: true }, // Used for soft deactivation
    isVerified: { type: Boolean, default: false }, // For KYC-type checks

    assignedOrders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    ],

    walletBalance: { type: Number, default: 0 },
    transactions: [transactionSchema],

    role: { type: String, default: "PickupPartner" }, // Fixed role for auth check

    lastKnownLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

const PickupPartner = mongoose.model("PickupPartner", pickupPartnerSchema);

export default PickupPartner;
