import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Order {
  _id: string;
  status: string;
  partnerId?: string;
  // Add more fields as per your actual order schema
}

export const autoAssignOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await axios.post<Order>(`${API_URL}/orders/${orderId}/auto-assign`);
    return response.data;
  } catch (err) {
    console.error("Failed to auto-assign order:", err);
    throw err;
  }
};
