import React, { useEffect } from "react";
import { toast } from "react-toastify";
import socket from "../socket"; // Shared socket instance

interface NotificationPayload {
  message?: string;
}

const Home: React.FC = () => {
  useEffect(() => {
    const handleNotification = (data: NotificationPayload) => {
      if (data?.message) {
        toast.info(`📢 ${data.message}`);
      } else {
        toast.info("📢 New Notification!");
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
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
