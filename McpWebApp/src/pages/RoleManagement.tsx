import { useEffect, useState } from "react";
import { updateUserRole } from "../firebase/roleUtils";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "staff" | "manager" | "admin";
  originalRole?: "staff" | "manager" | "admin";
}

const RoleManagement = () => {
  const { user } = useAuth(); // Admin user
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: User["role"] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`);
        if (!response.ok) throw new Error("Failed to fetch users");

        const data: User[] = await response.json();
        setUsers(data.map((u) => ({ ...u, originalRole: u.role })));
      } catch (fetchError) {
        console.error("Error fetching users:", fetchError);
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    if (!user) {
      setError("Unauthorized: Admin login required");
      return;
    }

    setLoading((prev) => ({ ...prev, [userId]: true }));
    setError(null);

    try {
      await updateUserRole(user.uid, userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole, originalRole: newRole } : u))
      );
      toast.success("Role updated successfully!");
      setSelectedRoles((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (updateError) {
      console.error("Error updating role:", updateError);
      setError("Failed to update role");
      toast.error("Failed to update role");
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Role Management</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => {
                const selectedRole = selectedRoles[u.id] ?? u.role;

                return (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          setSelectedRoles((prev) => ({
                            ...prev,
                            [u.id]: e.target.value as User["role"],
                          }))
                        }
                        disabled={loading[u.id] || user?.uid === u.id}
                        className="p-2 bg-gray-100 border rounded capitalize"
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                      {user?.uid === u.id && (
                        <p className="text-xs text-gray-500 mt-1">
                          You can't change your own role
                        </p>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRoleChange(u.id, selectedRole)}
                        disabled={
                          loading[u.id] ||
                          selectedRole === u.originalRole ||
                          user?.uid === u.id
                        }
                        className={`px-4 py-1 text-sm rounded text-white transition ${
                          loading[u.id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {loading[u.id] ? "Updating..." : "Update Role"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManagement;
