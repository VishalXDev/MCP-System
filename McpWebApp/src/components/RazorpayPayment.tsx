import React from "react";

// Define Razorpay options interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

// Define Razorpay response interface
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Define Razorpay instance interface
interface RazorpayInstance {
  open(): void;
}

// Extend window to include Razorpay constructor
interface CustomWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

declare const window: CustomWindow;

const RazorpayPayment: React.FC = () => {
  const handlePayment = () => {
    const options: RazorpayOptions = {
      key: "your_razorpay_key_id", // Replace with your actual key
      amount: 50000, // Amount in paise (₹500)
      currency: "INR",
      name: "MCP System",
      description: "Test Payment",
      handler: (response: RazorpayResponse) => {
        console.log("✅ Payment successful:", response);
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
        color: "#F37254",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
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
