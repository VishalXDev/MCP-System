import axios from "axios";
import { auth } from "../firebase";

// ---------- CONFIG ----------
export const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// ---------- TYPES ----------
export interface Order {
  _id: string;
  customer: string;
  status: string;
  partnerId?: string;
}

export interface User {
  _id: string;
  name: string;
  wallet: number;
  role: "admin" | "partner";
}

export interface Transaction {
  _id: string;
  user: string;
  amount: number;
  type: "credit" | "debit";
  createdAt: string;
}

export interface PayoutRequest {
  _id: string;
  userId: string;
  amount: number;
  status: "pending" | "approved";
}

// ---------- INTERCEPTORS ----------
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

// ---------- ERROR HANDLER ----------
const handleError = (err: unknown, message: string): never => {
  console.error(`${message}:`, err);
  throw new Error(message);
};

// ---------- ORDERS ----------
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data;
  } catch (err) {
    return handleError(err, "Error fetching orders");
  }
};

export const assignOrderPartner = async (
  orderId: string,
  partnerId: string
): Promise<Order> => {
  try {
    const res = await axios.post(`${API_URL}/orders/assign/${orderId}`, { partnerId });
    return res.data;
  } catch (err) {
    return handleError(err, "Error assigning partner");
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<Order> => {
  try {
    const res = await axios.post(`${API_URL}/orders/status/${orderId}`, { status });
    return res.data;
  } catch (err) {
    return handleError(err, "Error updating order status");
  }
};

// ---------- WALLET ----------
export const fetchWalletBalance = async (): Promise<number> => {
  try {
    const res = await axios.get(`${API_URL}/wallet/balance`);
    return res.data.balance;
  } catch (err) {
    return handleError(err, "Error fetching wallet balance");
  }
};

export const addMoneyToWallet = async (amount: number): Promise<void> => {
  try {
    await axios.post(`${API_URL}/wallet/add-money`, { amount });
  } catch (err) {
    return handleError(err, "Error adding money");
  }
};

export const fetchPayoutRequests = async (): Promise<PayoutRequest[]> => {
  try {
    const res = await axios.get(`${API_URL}/wallet/payout-requests`);
    return res.data;
  } catch (err) {
    return handleError(err, "Error fetching payout requests");
  }
};

export const approvePayout = async (payoutId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/wallet/approve-payout/${payoutId}`);
  } catch (err) {
    return handleError(err, "Error approving payout");
  }
};

// ---------- TRANSACTIONS ----------
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const res = await axios.get(`${API_URL}/transactions`);
    return res.data;
  } catch (err) {
    return handleError(err, "Error fetching transactions");
  }
};

// ---------- USERS ----------
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const res = await axios.get(`${API_URL}/users`);
    return res.data;
  } catch (err) {
    return handleError(err, "Error fetching users");
  }
};

export const addPickupPartner = async (data: Partial<User>): Promise<User> => {
  try {
    const res = await axios.post(`${API_URL}/users/add-partner`, data);
    return res.data;
  } catch (err) {
    return handleError(err, "Error adding pickup partner");
  }
};
