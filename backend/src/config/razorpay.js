import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,         // ✅ Should exist in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET, // ✅ Should exist in .env
});

export default razorpay;
