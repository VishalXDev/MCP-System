import { useEffect, useState } from "react";
import API from "../utils/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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
  role?: string;
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, userRes] = await Promise.all([
          API.get("/orders"),
          API.get("/users"),
        ]);

        setOrders(orderRes.data);
        setPartners(
          userRes.data.filter((u: Partner) => u.role === "partner")
        );
      } catch {
        setError("Failed to load reports data.");
        console.error("Error fetching reports data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const partnerStats = partners.map((p) => {
    const partnerOrders = orders.filter((o) => o.assignedTo === p._id);
    const completed = partnerOrders.filter(
      (o) => o.status === "delivered"
    ).length;
    const totalEarnings = partnerOrders.reduce(
      (sum, o) => sum + (o.status === "delivered" ? o.amount : 0),
      0
    );

    return {
      name: p.name,
      completed,
      earnings: totalEarnings.toFixed(2),
    };
  });

  const ordersByDate = Object.values(
    orders.reduce((acc, o) => {
      const date = new Date(o.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      acc[date] = acc[date] || { date, orders: 0, revenue: 0 };
      acc[date].orders += 1;
      acc[date].revenue += o.amount;
      return acc;
    }, {} as Record<string, { date: string; orders: number; revenue: number }>),
  ).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA00FF",
    "#FF4081",
  ];

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      {/* Order History Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Order History</h2>
        <div className="max-h-96 overflow-auto">
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
                  <td>
                    {partners.find((p) => p._id === o.assignedTo)?.name ||
                      "Unassigned"}
                  </td>
                  <td>₹ {o.amount.toFixed(2)}</td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partner Performance Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Partner Performance</h2>
        <div className="max-h-96 overflow-auto">
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

      {/* Orders Over Time Line Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-4">Orders Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ordersByDate}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="orders" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Over Time Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ordersByDate}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Partner Performance Pie Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-4">Partner Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={partnerStats}
              dataKey="completed"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {partnerStats.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
