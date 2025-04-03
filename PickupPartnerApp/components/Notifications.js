import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Update with deployed backend URL

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("notification", (message) => {
      setNotifications((prev) => [...prev, message]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded shadow">
      <h3 className="text-lg font-bold">Notifications</h3>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index} className="mt-2">{notif}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
