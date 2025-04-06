import Razorpay from "razorpay";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Razorpay with the provided credentials from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,    // Your Razorpay key_id
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // Your Razorpay key_secret
});

export default razorpay;
