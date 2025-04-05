import React, { useEffect } from "react";
import { toast } from "react-toastify";
import socket from "../socket"; // Reusable socket instance

const Home = () => {
  useEffect(() => {
    // Listen for real-time notifications
    socket.on("notification", (data) => {
      toast.info(data.message || "📢 New Notification!");
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 MCP Dashboard</h1>
      <p className="text-gray-600">Welcome! Real-time updates will appear as notifications.</p>
    </div>
  );
};

export default Home;
