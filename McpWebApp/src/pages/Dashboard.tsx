import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import API from "../utils/axios";

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeUsers: number;
  pendingOrders: number;
  walletBalance: number;
  unassignedOrders: number;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  assignedTo?: string;
}

interface Partner {
  isOnline: boolean;
  role: string;
}

interface User {
  role: string;
  wallet?: number;
  isOnline?: boolean;
}

const Dashboard: React.FC = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    walletBalance: 0,
    unassignedOrders: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usingFirebase = (import.meta.env.VITE_USE_FIREBASE as string) === "true";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) throw new Error("User not authenticated");

        const statsRef = doc(db, "dashboard", "stats");
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          setStats(statsSnap.data() as DashboardStats);
        } else {
          console.warn("No dashboard stats found!");
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError((err as Error)?.message || "An error occurred");
      }
    };

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const ordersSnap = await getDocs(ordersRef);
        const ordersList = ordersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(ordersList);

        const unassignedCount = ordersList.filter((order) => !order.assignedTo).length;
        setStats((prev) => ({
          ...prev,
          unassignedOrders: unassignedCount,
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchAPIData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          API.get("/users"),
          API.get("/orders"),
        ]);

        const users: User[] = userRes.data;
        const admin = users.find((u) => u.role === "admin");
        setWallet(admin?.wallet || 0);
        setOrders(orderRes.data);

        const partnersFiltered = users.filter(
          (u): u is Partner => u.role === "partner" && typeof u.isOnline === "boolean"
        );
        setPartners(partnersFiltered);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    const fetchData = async () => {
      try {
        if (usingFirebase) {
          await Promise.all([fetchStats(), fetchOrders()]);
        } else {
          await fetchAPIData();
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, usingFirebase]);

  const dashboardCards = useMemo(
    () =>
      [
        { title: "Total Orders", value: stats.totalOrders, color: "text-blue-500", visible: role === "admin" || role === "pickup-partner" },
        { title: "Revenue", value: `₹${stats.revenue?.toLocaleString?.() ?? 0}`, color: "text-green-500", visible: role === "admin" },
        { title: "Active Users", value: stats.activeUsers, color: "text-purple-500", visible: role === "admin" },
        { title: "Pending Orders", value: stats.pendingOrders, color: "text-red-500", visible: role === "admin" || role === "pickup-partner" },
        { title: "Wallet Balance", value: `₹${stats.walletBalance?.toLocaleString?.() ?? 0}`, color: "text-yellow-500", visible: role === "admin" },
        { title: "Unassigned Orders", value: stats.unassignedOrders, color: "text-orange-500", visible: role === "admin" },
      ].filter((card) => card.visible),
    [stats, role]
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center h-screen text-red-500">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  const renderFirebaseDashboard = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.displayName || user?.email || "User"}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} title={card.title} value={card.value} color={card.color} />
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border p-3 text-left">Customer</th>
              <th className="border p-3 text-left">Amount</th>
              <th className="border p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="border p-3">{order.customer}</td>
                  <td className="border p-3">₹{order.amount.toLocaleString()}</td>
                  <td className={`border p-3 ${order.status === "Pending" ? "text-red-500" : "text-green-500"}`}>
                    {order.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-3 text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAPIDashboard = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">MCP Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Wallet Balance</h2>
          <p className="text-2xl font-bold text-green-600">₹{wallet}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Partners Online</h2>
          <p className="text-2xl font-bold">
            {partners.filter((p) => p.isOnline).length} / {partners.length}
          </p>
        </div>
      </div>
    </div>
  );

  return usingFirebase ? renderFirebaseDashboard() : renderAPIDashboard();
};

const DashboardCard: React.FC<{ title: string; value: string | number; color: string }> = ({
  title,
  value,
  color,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center transition-transform transform hover:scale-105">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default Dashboard;
