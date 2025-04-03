import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeUsers: number;
  pendingOrders: number;
}

const Dashboard = () => {
  const { user, role } = useAuth(); // ✅ Get user & role from AuthContext
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) throw new Error("User not authenticated"); // ✅ Prevents fetching if user is null

        const statsRef = doc(db, "dashboard", "stats");
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          setStats(statsSnap.data() as DashboardStats); // ✅ Type assertion fixes the error
        } else {
          console.warn("No stats found in Firestore!");
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // ✅ Memoized card data to optimize rendering
  const dashboardCards = useMemo(() => {
    return [
      {
        title: "Total Orders",
        value: stats.totalOrders,
        color: "text-blue-500",
        visible: role === "admin" || role === "pickup-partner",
      },
      {
        title: "Revenue",
        value: `₹${stats.revenue.toLocaleString()}`,
        color: "text-green-500",
        visible: role === "admin",
      },
      {
        title: "Active Users",
        value: stats.activeUsers,
        color: "text-purple-500",
        visible: role === "admin",
      },
      {
        title: "Pending Orders",
        value: stats.pendingOrders,
        color: "text-red-500",
        visible: role === "admin" || role === "pickup-partner",
      },
    ].filter((card) => card.visible);
  }, [stats, role]);

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

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.displayName || user?.email || "User"}!</h1>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} title={card.title} value={card.value} color={card.color} />
        ))}
      </div>
    </div>
  );
};

// ✅ Reusable Card Component
const DashboardCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center transition-transform transform hover:scale-105">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

export default Dashboard;
