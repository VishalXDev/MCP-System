import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

interface User {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "pickup-partner";
  active: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnap = await getDocs(usersRef);
        const usersList = usersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);
      } catch (err: unknown) {
        console.error("Error fetching users:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { active: !currentStatus });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: !currentStatus } : user
        )
      );
    } catch (err: unknown) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status. Please try again.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <p className="text-center text-white">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 text-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
                <td className="border p-3">{user.name || "N/A"}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3 capitalize">{user.role}</td>
                <td className="border p-3">
                  <span className={user.active ? "text-green-400" : "text-red-400"}>
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => toggleUserStatus(user.id, user.active)}
                    disabled={updatingUserId === user.id}
                    className={`px-4 py-2 rounded font-semibold transition duration-200 ${
                      user.active
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white disabled:opacity-50`}
                  >
                    {updatingUserId === user.id
                      ? "Updating..."
                      : user.active
                      ? "Disable"
                      : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
