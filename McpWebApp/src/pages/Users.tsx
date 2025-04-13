import { useEffect, useState } from "react";
import { updateUserRole } from "../firebase/roleUtils";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProtectedRoute from "../components/ProtectedRoute";

// Define a strict type for User
interface User {
  id: string;
  name: string;
  email: string;
  role: "staff" | "manager" | "admin";
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: "staff" | "manager" | "admin" }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData: User[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        }));
        setUsers(usersData);
      } catch (err: unknown) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  // Handle role selection
  const handleRoleChange = (userId: string, newRole: "staff" | "manager" | "admin") => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  // Update user role in Firestore
  const handleUpdateRole = async (userId: string) => {
    const newRole = selectedRoles[userId];
    const adminUid = auth.currentUser?.uid;

    if (!newRole || !adminUid) return;

    setLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      await updateUserRole(adminUid, userId, newRole);
      alert("User role updated successfully!");

      // Update UI after role change
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
    } catch (err: unknown) {
      console.error("Failed to update role:", err);
      alert("Error updating role. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">User Management</h2>

        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full text-left bg-gray-900 border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="p-3">{user.name || "N/A"}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <select
                      value={selectedRoles[user.id] || user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as "staff" | "manager" | "admin")}
                      className="p-2 rounded bg-gray-700"
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUpdateRole(user.id)}
                      disabled={loading[user.id]}
                      className={`py-1 px-3 rounded text-white ${
                        loading[user.id] ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                      }`}
                    >
                      {loading[user.id] ? "Updating..." : "Update Role"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-3">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
};

export default Users;
