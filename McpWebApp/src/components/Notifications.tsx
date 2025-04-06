// src/components/Notifications.tsx
import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";

interface NotificationProps {
  id: number;
  message: string;
  type: "success" | "error";
  onClose: (id: number) => void;
  index: number;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  message,
  type,
  onClose,
  index,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onClose(id), 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, onClose]);

  return (
    <div
      className={`fixed right-5 p-4 rounded-lg shadow-lg text-white text-sm transition-transform duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
      style={{ top: `${index * 70 + 20}px` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button className="ml-2 font-bold" onClick={() => onClose(id)}>
          ✖
        </button>
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: "success" | "error" }[]
  >([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleNotification = (data: { message: string; type: "success" | "error" }) => {
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), message: data.message, type: data.type },
      ]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {notifications.map((notif, index) => (
        <NotificationItem
          key={notif.id}
          {...notif}
          index={index}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default Notifications;
