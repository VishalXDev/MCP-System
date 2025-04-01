import React, { useState, useEffect, useRef } from "react";

interface NotificationProps {
  id: number;
  message: string;
  type: "success" | "error";
  onClose: (id: number) => void;
  index: number; // Added index to position notifications dynamically
}

const NotificationItem: React.FC<NotificationProps> = ({ id, message, type, onClose, index }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onClose(id), 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id]); // Removed onClose dependency to prevent unnecessary resets

  return (
    <div
      className={`fixed right-5 p-4 rounded-lg shadow-lg text-white text-sm transition-all duration-300 transform opacity-100 scale-100
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
        top-[${index * 60 + 20}px] opacity-0 scale-90 animate-fadeIn`}
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
  >([
    { id: 1, message: "Order #12345 has been shipped!", type: "success" },
    { id: 2, message: "Payment failed for Order #12346", type: "error" },
  ]);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
