import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "../firebase"; // Ensure correct Firebase imports

interface Notification {
  id: string;
  title: string;
  body: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Request permission for notifications
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");

        // Get Firebase Messaging Token
        getToken(messaging, {
          vapidKey:
            "BCdqdIaMv0Lji3_ZgURU_gKBJ63UKmIxarnPjHwLcKEwC24N9RpmJ93HeCB0Ax-W18iBfcYEiX4NFRcRsyCwsak",
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              // Send this token to your backend to register for notifications
            } else {
              console.log("No registration token available.");
            }
          })
          .catch((err) => console.log("Error getting token:", err));
      }
    });

    // Listen for incoming notifications
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);

      const newNotification: Notification = {
        id: payload.messageId || Date.now().toString(),
        title: payload.notification?.title || "New Notification",
        body: payload.notification?.body || "",
      };

      setNotifications((prev) => [newNotification, ...prev]);
    });
  }, []);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      <ul>
        {notifications.length === 0 ? (
          <li className="text-gray-400">No new notifications</li>
        ) : (
          notifications.map((notification) => (
            <li key={notification.id} className="p-2 border-b border-gray-700">
              <strong>{notification.title}</strong>: {notification.body}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notifications;
