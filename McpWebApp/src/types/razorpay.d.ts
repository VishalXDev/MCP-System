declare module 'razorpay' {
    // Define the Razorpay response interface
    export interface RazorpayResponse {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }
  
    interface RazorpayOptions {
      key: string; // Your Razorpay Key ID
      amount: number; // Amount to be paid (in paise)
      currency: string; // Currency, e.g., 'INR'
      name: string; // Your company or website name
      description?: string; // Description of the payment
      image?: string; // URL to an image to display in the Razorpay modal
      handler?: (response: RazorpayResponse) => void; // Callback when payment is successful
      prefill?: {
        name: string;
        email: string;
        contact: string;
      }; // Prefill payment fields (optional)
      notes?: {
        [key: string]: string;
      }; // Any additional notes
      theme?: {
        color: string; // Custom theme color for Razorpay modal
      };
    }
  
    class Razorpay {
      constructor(options: RazorpayOptions);
  
      open(): void; // Opens the Razorpay checkout modal
      close(): void; // Closes the Razorpay checkout modal
    }
  
    export = Razorpay;
  }
  