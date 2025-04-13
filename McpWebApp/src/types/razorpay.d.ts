// src/types/razorpay.d.ts

declare module 'razorpay' {
  export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  export interface RazorpayPrefill {
    name: string;
    email: string;
    contact: string;
  }

  export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    handler?: (response: RazorpayResponse) => void;
    prefill?: RazorpayPrefill;
    notes?: Record<string, string>;
    theme?: {
      color: string;
    };
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    open(): void;
    close(): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
  }

  export default Razorpay;
}
