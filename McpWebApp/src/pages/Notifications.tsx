import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  timestamp: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      setNotifications(data.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)));
    });

    return () => unsub();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`p-4 rounded shadow bg-${n.read ? "gray-100" : "blue-50"} border-l-4 ${
              n.type === "order"
                ? "border-blue-500"
                : n.type === "payment"
                ? "border-green-500"
                : "border-yellow-500"
            }`}
          >
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm">{n.body}</p>
            <span className="text-xs text-gray-500">{new Date(n.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
