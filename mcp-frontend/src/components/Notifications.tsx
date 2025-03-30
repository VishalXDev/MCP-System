import React, { useState, useEffect } from "react";

interface NotificationProps {
  id: number;
  message: string;
  type: "success" | "error";
  onClose: (id: number) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
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
      {notifications.map((notif) => (
        <NotificationItem key={notif.id} {...notif} onClose={removeNotification} />
      ))}
    </div>
  );
};

export default Notifications;
