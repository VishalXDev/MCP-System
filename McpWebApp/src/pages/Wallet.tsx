import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  interface PayoutRequest {
    _id: string;
    userId: string;
    amount: number;
    status: string;
  }
  
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWalletBalance();
    fetchPayoutRequests();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wallet/balance`);
      setWalletBalance(res.data.balance);
    } catch (error) {
      setError("Failed to fetch wallet balance.");
      console.error(error);
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wallet/payout-requests`);
      setPayoutRequests(res.data);
    } catch (error) {
      setError("Failed to fetch payout requests.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approvePayout = async (id: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/wallet/approve-payout/${id}`);
      fetchPayoutRequests();
    } catch (error) {
      setError("Failed to approve payout.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold">Wallet Page</h1>
      <p className="text-gray-400 mt-2">Manage your transactions and balance here.</p>

      <h2 className="text-2xl font-bold my-4">Wallet Balance: ₹{walletBalance}</h2>

      {error && <p className="text-red-500">{error}</p>}

      <h3 className="text-xl font-semibold mb-2">Payout Requests</h3>

      {loading ? (
        <p>Loading payout requests...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-2">User</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payoutRequests.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-2 text-center">No payout requests found.</td>
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
      )}
    </div>
  );
};

export default Wallet;
