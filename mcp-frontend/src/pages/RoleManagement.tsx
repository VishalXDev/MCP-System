import { useEffect, useState } from "react";
import { updateUserRole } from "../firebase/roleUtils";

interface User {
  id: string;
  name: string;
  email: string;
  role: "staff" | "manager" | "admin";
}

const RoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    // Mock user data (replace with API call if needed)
    setUsers([
      { id: "1", name: "John Doe", email: "john@example.com", role: "staff" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "manager" },
    ]);
  }, []);

  const handleRoleChange = async (userId: string, newRole: "staff" | "manager" | "admin") => {
    setLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
      alert("Role updated successfully");
    } catch (error) {
      console.error("Error updating role", error);
      alert("Failed to update role");
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Role Management</h2>
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
  );
};

export default RoleManagement;