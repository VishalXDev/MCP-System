import crypto from "crypto";
// Function to verify Razorpay payment signature
const verifyPayment = (paymentDetails) => {
  const { paymentId, orderId, signature } = paymentDetails;

  // Generate signature for verification
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(orderId + "|" + paymentId);
  const generatedSignature = shasum.digest("hex");

  if (generatedSignature === signature) {
    return true; // Payment is verified
  }
  return false; // Payment verification failed
};

export default verifyPayment;
