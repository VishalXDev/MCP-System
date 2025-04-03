import { useEffect, useState } from "react";
import { updateUserRole } from "../firebase/roleUtils";
import { useAuth } from "../context/AuthContext"; // ✅ Import AuthContext

interface User {
  id: string;
  name: string;
  email: string;
  role: "staff" | "manager" | "admin";
  originalRole?: "staff" | "manager" | "admin";
}

const RoleManagement = () => {
  const { user } = useAuth(); // ✅ Get logged-in user (Admin)
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users"); // Replace with actual API
        const data: User[] = await response.json();
        setUsers(data.map(user => ({ ...user, originalRole: user.role })));
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "staff" | "manager" | "admin") => {
    if (!user) {
      setError("Unauthorized: Admin login required");
      return;
    }

    setLoading((prev) => ({ ...prev, [userId]: true }));
    setError(null);

    try {
      await updateUserRole(user.uid, userId, newRole); // ✅ Pass admin UID as first argument
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
    } catch (error) {
      console.error("Error updating role", error);
      setError("Failed to update role");
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Role Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full border border-gray-700">
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
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as User["role"])}
                    className="p-2 bg-gray-700 rounded"
                    disabled={loading[user.id]}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleRoleChange(user.id, user.role)}
                    disabled={loading[user.id] || user.role === user.originalRole}
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
  );
};

export default RoleManagement;
