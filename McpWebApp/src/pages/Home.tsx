import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import socket from "../socket";

interface NotificationPayload {
  message?: string;
}

const Home: React.FC = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleNotification = (data: NotificationPayload) => {
      toast.info(`📢 ${data?.message || "New Notification!"}`);
    };

    const handleConnect = () => {
      setConnected(true);
      console.log("✅ Connected to socket server");
    };

    const handleDisconnect = () => {
      setConnected(false);
      console.warn("⚠️ Disconnected from socket server");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 MCP Dashboard</h1>
      <p className="text-gray-600 mb-2">Welcome! Real-time updates will appear as notifications.</p>
      <p className={`text-sm ${connected ? "text-green-600" : "text-red-500"}`}>
        {connected ? "🔗 Connected to real-time server." : "❌ Not connected to real-time server."}
      </p>
    </div>
  );
};

export default Home;
