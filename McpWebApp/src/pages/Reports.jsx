import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Reports = () => {
  const [orderData, setOrderData] = useState([]);
  const [partnerData, setPartnerData] = useState([]);

  useEffect(() => {
    // Replace with your real endpoints
    const fetchData = async () => {
      const ordersRes = await axios.get("/api/orders/stats");
      const partnersRes = await axios.get("/api/partners/performance");
      setOrderData(ordersRes.data);
      setPartnerData(partnersRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">📈 Order Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={orderData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>

      <h2 className="text-2xl font-bold">📊 Partner Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={partnerData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="partner" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completedOrders" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Reports;
