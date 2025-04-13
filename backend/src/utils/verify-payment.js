import crypto from "crypto";

// Function to verify Razorpay payment signature
const verifyPayment = (paymentDetails) => {
  const { paymentId, orderId, signature } = paymentDetails;

  if (!paymentId || !orderId || !signature) {
    throw new Error("Missing required payment verification fields");
  }

  // Generate signature for verification
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest("hex");

  // Optional logging for dev environment
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Expected Signature:", generatedSignature);
    console.log("🆚 Provided Signature:", signature);
  }

  // Throw error instead of returning false (optional)
  if (generatedSignature !== signature) {
    throw new Error("Invalid payment signature");
  }

  return true; // ✅ Payment is verified
};

export default verifyPayment;
