import mongoose from "mongoose";

const PickupPartnerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  walletBalance: { type: Number, default: 0 },
});

export default mongoose.model("PickupPartner", PickupPartnerSchema);
