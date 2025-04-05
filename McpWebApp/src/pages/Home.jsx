import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Home = () => {
  useEffect(() => {
    socket.on("notification", (data) => {
      toast.info(data.message || "📢 New Notification!");
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📊 MCP Dashboard</h1>
      {/* Your dashboard cards/components here */}
    </div>
  );
};

export default Home;
