import { useEffect, useState } from "react";
import API from "../utils/axios";

type Role = "admin" | "partner" | "staff";

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
  role: Role;
}

export default function WalletPage() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [adminBalance, setAdminBalance] = useState<number>(0);
  const [partners, setPartners] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [addAmount, setAddAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError("");
      await Promise.all([
        fetchWalletBalance(),
        fetchPayoutRequests(),
        fetchAdminAndTransactions(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const res = await API.get("/wallet/balance");
      setWalletBalance(res.data.balance);
    } catch (err) {
      console.error("Wallet balance error:", err);
      setError("Failed to fetch wallet balance.");
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      const res = await API.get("/wallet/payout-requests");
      setPayoutRequests(res.data);
    } catch (err) {
      console.error("Payout request error:", err);
      setError("Failed to fetch payout requests.");
    }
  };

  const approvePayout = async (id: string) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this payout?");
    if (!confirmApprove) return;

    setApprovingId(id);
    try {
      await API.post(`/wallet/approve-payout/${id}`);
      await fetchPayoutRequests();
      await fetchAdminAndTransactions();
    } catch (err) {
      console.error("Approve payout error:", err);
      setError("Failed to approve payout.");
    } finally {
      setApprovingId(null);
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

      const sortedTransactions = txnRes.data.sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTransactions(sortedTransactions);
    } catch (err) {
      console.error("Admin/wallet fetch error:", err);
      setError("Failed to load wallet details.");
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/wallet/add-money", { amount: addAmount });
      alert("Money added successfully!");
      setAddAmount(0);
      fetchWalletBalance();
      fetchAdminAndTransactions();
    } catch (err) {
      console.error("Add money error:", err);
      setError("Failed to add money.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading wallet data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Wallet & Transactions</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Admin Wallet Section */}
      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Admin Wallet Balance</h2>
        <p className="text-2xl text-green-600">₹ {adminBalance.toFixed(2)}</p>

        <form onSubmit={handleAddMoney} className="mt-4 flex items-center gap-2">
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(Number(e.target.value))}
            placeholder="Enter amount"
            className="border p-2 rounded w-40"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Money
          </button>
        </form>
      </div>

      {/* API Wallet */}
      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Wallet Balance (API)</h2>
        <p className="text-2xl text-blue-600">₹ {walletBalance.toFixed(2)}</p>
      </div>

      {/* Pickup Partner Wallets */}
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

      {/* All Transactions */}
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

      {/* Payout Requests */}
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
              payoutRequests.map((req) => {
                const partnerName = partners.find((p) => p._id === req.userId)?.name || req.userId;
                return (
                  <tr key={req._id} className="border">
                    <td className="p-2">{partnerName}</td>
                    <td className="p-2">₹{req.amount}</td>
                    <td className="p-2">{req.status}</td>
                    <td className="p-2">
                      {req.status === "pending" && (
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50"
                          onClick={() => approvePayout(req._id)}
                          disabled={approvingId === req._id}
                        >
                          {approvingId === req._id ? "Approving..." : "Approve"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
