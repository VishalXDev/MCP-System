import React, { useEffect, useState } from "react";

const Dashboard = () => {
  // Simulated API data (replace with actual API calls)
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    // Simulating fetching data from an API
    setTimeout(() => {
      setStats({
        totalOrders: 1245,
        revenue: 320500,
        activeUsers: 780,
        pendingOrders: 32,
      });
    }, 1000); // Fake delay for API simulation
  }, []);

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Dashboard Widget - Total Orders */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-500">{stats.totalOrders}</p>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-3xl font-bold text-green-500">
            ₹{stats.revenue.toLocaleString()}
          </p>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Active Users</h2>
          <p className="text-3xl font-bold text-purple-500">{stats.activeUsers}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Pending Orders</h2>
          <p className="text-3xl font-bold text-red-500">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
