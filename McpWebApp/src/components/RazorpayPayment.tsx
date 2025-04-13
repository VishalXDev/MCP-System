import React from "react";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorEvent {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

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

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayErrorEvent) => void): void;
}

interface CustomWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
declare const window: CustomWindow;

interface RazorpayPaymentProps {
  amount: number; // in paise (e.g. ₹10 = 1000 paise)
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (response: RazorpayResponse) => void;
  onFailure?: (error: RazorpayErrorEvent) => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  description,
  prefill = {},
  onSuccess,
  onFailure,
}) => {
  const handlePayment = () => {
    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_dummykey",
      amount,
      currency: "INR",
      name: "MCP System",
      description,
      handler: (response: RazorpayResponse) => {
        console.log("✅ Payment successful:", response);
        onSuccess?.(response);
      },
      prefill,
      theme: {
        color: "#F37254",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    razorpay.on("payment.failed", (response: RazorpayErrorEvent) => {
      console.error("❌ Payment Failed:", response.error);
      alert(`Payment Failed: ${response.error.description}`);
      onFailure?.(response);
    });
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
    >
      Pay Now ₹{(amount / 100).toFixed(2)}
    </button>
  );
};

export default RazorpayPayment;
