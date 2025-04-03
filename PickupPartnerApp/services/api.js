import axios from 'axios';

const API_URL = 'https://your-backend-api-url.com'; // Replace with your API URL

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const acceptOrder = async (orderId) => {
  try {
    await axios.post(`${API_URL}/orders/accept`, { orderId });
  } catch (error) {
    console.error('Error accepting order:', error);
  }
};

export const rejectOrder = async (orderId) => {
  try {
    await axios.post(`${API_URL}/orders/reject`, { orderId });
  } catch (error) {
    console.error('Error rejecting order:', error);
  }
};

export const fetchWalletData = async () => {
  try {
    const response = await axios.get(`${API_URL}/wallet`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return { balance: 0, transactions: [] };
  }
};
import { BACKEND_URL } from '@env';

export const fetchOrders = async () => {
    const response = await fetch(`${BACKEND_URL}/orders`);
    return response.json();
};
