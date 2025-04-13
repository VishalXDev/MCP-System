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

    profilePicture: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    walletBalance: { type: Number, default: 0 },
    transactions: [transactionSchema],

    commission: { type: Number, default: 0 }, // ✅ Include commission here

    role: { type: String, default: "PickupPartner" },

    lastKnownLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Exporting using ES Module syntax
const PickupPartner = mongoose.model("PickupPartner", pickupPartnerSchema);
export default PickupPartner;
