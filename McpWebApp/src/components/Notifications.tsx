import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationData {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationProps extends NotificationData {
  index: number;
  onClose: (id: number) => void;
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

  const bgClass = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500 text-black",
  }[type];

  return (
    <div
      className={`fixed right-5 p-4 rounded-lg shadow-md text-sm transition-all duration-300 animate-fade-in ${bgClass}`}
      style={{ top: `${index * 70 + 20}px`, zIndex: 9999 }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-between gap-2 text-white">
        <span>{message}</span>
        <button
          onClick={() => onClose(id)}
          className="ml-2 font-bold focus:outline-none"
          aria-label="Close notification"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNotification = (data: { message: string; type: NotificationType }) => {
      setNotifications((prev) => [
        ...prev.slice(-3), // keep max 4 notifications
        { id: Date.now(), message: data.message, type: data.type },
      ]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
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
