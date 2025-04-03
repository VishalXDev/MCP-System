import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client"; // Import WebSocket client

// Initialize WebSocket connection (replace with your backend URL)
const socket = io("https://your-backend-url.com");

interface NotificationProps {
  id: number;
  message: string;
  type: "success" | "error";
  onClose: (id: number) => void;
  index: number; // To dynamically position notifications
}

const NotificationItem: React.FC<NotificationProps> = ({ id, message, type, onClose, index }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onClose(id), 3000); // Auto-dismiss after 3s

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id]); 

  return (
    <div
      className={`fixed right-5 p-4 rounded-lg shadow-lg text-white text-sm transition-all duration-300 transform opacity-100 scale-100
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
        `}
      style={{ top: `${index * 60 + 20}px` }} // Dynamic positioning
    >
      {message}
      <button className="ml-4 text-white font-bold" onClick={() => onClose(id)}>
        ✖
      </button>
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: "success" | "error" }[]
  >([]);

  useEffect(() => {
    const handleNotification = (data: { message: string; type: "success" | "error" }) => {
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), message: data.message, type: data.type }, // Add new notification
      ]);
    };

    socket.on("notification", handleNotification); // Listen for notifications

    return () => {
      socket.off("notification", handleNotification); // Cleanup on unmount
    };
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id)); // Remove notification
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {notifications.map((notif, index) => (
        <NotificationItem key={notif.id} {...notif} index={index} onClose={removeNotification} />
      ))}
    </div>
  );
};

export default Notifications;
