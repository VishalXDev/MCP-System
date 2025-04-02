import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "PickupPartner" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["wallet", "order", "system"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
