import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  timestamp: string | Date;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const data = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const docData = doc.data();
          return {
            id: doc.id,
            title: docData.title ?? "Untitled",
            body: docData.body ?? "No details provided.",
            type: docData.type ?? "info",
            read: docData.read ?? false,
            timestamp:
              typeof docData.timestamp?.toDate === "function"
                ? docData.timestamp.toDate()
                : new Date(docData.timestamp ?? Date.now()),
          } as Notification;
        }
      );

      setNotifications(
        data.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
    });

    return () => unsub();
  }, []);

  const formatDate = (timestamp: string | Date) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-gray-500 flex items-center gap-2">
          <span className="text-xl">📭</span>
          <span>No notifications available.</span>
        </div>
      ) : (
        <ul className="space-y-4" aria-live="polite">
          {notifications.map((n) => {
            const borderColor =
              n.type === "order"
                ? "border-blue-500"
                : n.type === "payment"
                ? "border-green-500"
                : "border-yellow-500";

            return (
              <li
                key={n.id}
                className={`p-4 rounded-md shadow-md bg-white border-l-4 ${borderColor} ${
                  n.read ? "opacity-60" : "opacity-100"
                } transition`}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {n.title}
                </h3>
                <p className="text-sm text-gray-600">{n.body}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  {formatDate(n.timestamp)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
