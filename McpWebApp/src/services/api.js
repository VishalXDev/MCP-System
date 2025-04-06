import axios from "axios";
import { auth } from "../firebase";

export const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// 🔐 Optional: Attach Firebase token if backend uses Firebase Admin SDK for auth
axios.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Failed to attach auth token:", err);
    }
  }
  return config;
});

// -------------------- ORDERS --------------------

export const fetchOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
};

export const assignOrderPartner = async (orderId, partnerId) => {
  try {
    const res = await axios.post(`${API_URL}/orders/assign/${orderId}`, { partnerId });
    return res.data;
  } catch (err) {
    console.error("Error assigning partner:", err);
    throw err;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axios.post(`${API_URL}/orders/status/${orderId}`, { status });
    return res.data;
  } catch (err) {
    console.error("Error updating order status:", err);
    throw err;
  }
};

// -------------------- WALLET --------------------

export const fetchWalletBalance = async () => {
  try {
    const res = await axios.get(`${API_URL}/wallet/balance`);
    return res.data.balance;
  } catch (err) {
    console.error("Error fetching wallet balance:", err);
    return 0;
  }
};

export const addMoneyToWallet = async (amount) => {
  try {
    const res = await axios.post(`${API_URL}/wallet/add-money`, { amount });
    return res.data;
  } catch (err) {
    console.error("Error adding money:", err);
    throw err;
  }
};

export const fetchPayoutRequests = async () => {
  try {
    const res = await axios.get(`${API_URL}/wallet/payout-requests`);
    return res.data;
  } catch (err) {
    console.error("Error fetching payout requests:", err);
    return [];
  }
};

export const approvePayout = async (payoutId) => {
  try {
    const res = await axios.post(`${API_URL}/wallet/approve-payout/${payoutId}`);
    return res.data;
  } catch (err) {
    console.error("Error approving payout:", err);
    throw err;
  }
};

// -------------------- TRANSACTIONS --------------------

export const fetchTransactions = async () => {
  try {
    const res = await axios.get(`${API_URL}/transactions`);
    return res.data;
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return [];
  }
};

// -------------------- USERS --------------------

export const fetchUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`);
    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};

export const addPickupPartner = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/users/add-partner`, data);
    return res.data;
  } catch (err) {
    console.error("Error adding pickup partner:", err);
    throw err;
  }
};
