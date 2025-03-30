import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  const [data, setData] = useState<{ wallet: number; orders: number; partners: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/dashboard-metrics");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Wallet Balance" value={`₹${data?.wallet}`} />
        <DashboardCard title="Active Orders" value={`${data?.orders}`} />
        <DashboardCard title="Pickup Partners" value={`${data?.partners}`} />
      </div>
    </div>
  );
};

export default Dashboard;
