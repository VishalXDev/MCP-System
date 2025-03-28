import axios from "axios";

const API_URL = "http://localhost:5000"; // Change this to your backend URL

export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(`${API_URL}/orders/${orderId}`, { status });
  return response.data;
};
