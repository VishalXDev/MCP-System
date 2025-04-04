import { useEffect, useState } from "react";
import API from "../utils/axios.ts";

interface Order {
  _id: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  amount: number;
}

interface Partner {
  _id: string;
  name: string;
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const orderRes = await API.get("/orders");
      const userRes = await API.get("/users");
  
      setOrders(orderRes.data);
  
      setPartners(
        userRes.data.filter((u: { role: string }) => u.role === "partner")
      );
    };
    fetchData();
  }, []);

  const partnerStats = partners.map((p) => {
    const partnerOrders = orders.filter((o) => o.assignedTo === p._id);
    const completed = partnerOrders.filter((o) => o.status === "delivered").length;
    const totalEarnings = partnerOrders.reduce((sum, o) => sum + (o.status === "delivered" ? o.amount : 0), 0);

    return {
      name: p.name,
      completed,
      earnings: totalEarnings.toFixed(2),
    };
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Order History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Order ID</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td>{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.status}</td>
                <td>{partners.find((p) => p._id === o.assignedTo)?.name || "Unassigned"}</td>
                <td>₹ {o.amount.toFixed(2)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Partner Performance</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Completed Orders</th>
              <th>Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {partnerStats.map((stat, i) => (
              <tr key={i} className="border-t">
                <td>{stat.name}</td>
                <td>{stat.completed}</td>
                <td>₹ {stat.earnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
