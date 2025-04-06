import React from "react";
import Razorpay from "razorpay";

// RazorpayPayment Component
const RazorpayPayment = () => {
  const handlePayment = () => {
    const razorpay = new Razorpay({
      key: "your_razorpay_key_id", // Replace with your Razorpay Key ID
      amount: 50000, // Example amount in paise (50000 paise = 500 INR)
      currency: "INR",
      name: "MCP System",
      description: "Test payment",
      handler: (response: Razorpay.RazorpayResponse) => { // Use RazorpayResponse from Razorpay module
        console.log("Payment successful:", response);
        // Handle the response after successful payment
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
        console.log("Payment ID:", razorpay_payment_id);
        console.log("Order ID:", razorpay_order_id);
        console.log("Signature:", razorpay_signature);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#F37254", // Customize theme color
      },
    });

    razorpay.open(); // Open the Razorpay payment modal
  };

  return (
    <div>
      <button onClick={handlePayment} className="bg-blue-600 text-white py-2 px-4 rounded">
        Pay Now
      </button>
    </div>
  );
};

export default RazorpayPayment;
