import { useEffect, useState } from "react";
import axios from "axios";
import API from "../utils/axios.ts";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface PayoutRequest {
  _id: string;
  userId: string;
  amount: number;
  status: string;
}

interface Transaction {
  _id: string;
  user: string;
  amount: number;
  type: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  wallet: number;
  role: string;
}

export default function WalletPage() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [adminBalance, setAdminBalance] = useState<number>(0);
  const [partners, setPartners] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWalletBalance();
    fetchPayoutRequests();
    fetchAdminAndTransactions();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wallet/balance`);
      setWalletBalance(res.data.balance);
    } catch (err) {
      console.error("Wallet balance error:", err);
      setError("Failed to fetch wallet balance.");
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wallet/payout-requests`);
      setPayoutRequests(res.data);
    } catch (err) {
      console.error("Payout request error:", err);
      setError("Failed to fetch payout requests.");
    }
  };

  const approvePayout = async (id: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/wallet/approve-payout/${id}`);
      fetchPayoutRequests();
    } catch (err) {
      console.error("Approve payout error:", err);
      setError("Failed to approve payout.");
    }
  };

  const fetchAdminAndTransactions = async () => {
    try {
      const userRes = await API.get("/users");
      const txnRes = await API.get("/transactions");

      const admin = userRes.data.find((u: User) => u.role === "admin");
      const partnersOnly = userRes.data.filter((u: User) => u.role === "partner");

      setAdminBalance(admin?.wallet || 0);
      setPartners(partnersOnly);
      setTransactions(txnRes.data.reverse());
    } catch (err) {
      console.error("Admin/wallet fetch error:", err);
      setError("Failed to load wallet details.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Wallet & Transactions</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Admin Wallet Balance</h2>
        <p className="text-2xl text-green-600">₹ {adminBalance.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Wallet Balance (API)</h2>
        <p className="text-2xl text-blue-600">₹ {walletBalance.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Pickup Partner Wallets</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Wallet Balance</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p._id} className="border-t">
                <td>{p.name}</td>
                <td>₹ {p.wallet.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">All Transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className="border-t">
                <td>{txn.user}</td>
                <td>₹ {txn.amount.toFixed(2)}</td>
                <td className={txn.type === "credit" ? "text-green-600" : "text-red-600"}>
                  {txn.type}
                </td>
                <td>{new Date(txn.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Payout Requests</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">User</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payoutRequests.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-2 text-center">
                  No payout requests found.
                </td>
              </tr>
            ) : (
              payoutRequests.map((req) => (
                <tr key={req._id} className="border">
                  <td className="p-2">{req.userId}</td>
                  <td className="p-2">₹{req.amount}</td>
                  <td className="p-2">{req.status}</td>
                  <td className="p-2">
                    {req.status === "pending" && (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => approvePayout(req._id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
