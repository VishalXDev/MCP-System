import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Define role type to restrict values
type Role = "admin" | "manager" | "staff";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: Role;
}

const AdminControls = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newRole, setNewRole] = useState<Role>("staff");
  const [loading, setLoading] = useState(false);

  // Fetch users on load
  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users."));
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUserId) return toast.warn("Please select a user.");

    try {
      setLoading(true);

      await axios.put("/api/admin/update-role", {
        userId: selectedUserId,
        role: newRole,
      });

      toast.success("✅ Role updated successfully!");

      // Update UI
      const updatedUsers = users.map((user) =>
        user._id === selectedUserId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "❌ Failed to update role.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("❌ An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-red-500 rounded">
      <h3 className="text-xl font-semibold text-red-600 mb-4">Admin Controls</h3>

      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="p-2 border rounded w-full mb-3 bg-white text-black"
      >
        <option value="">-- Select User --</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email}) — Role: {user.role || "unknown"}
          </option>
        ))}
      </select>

      <select
        value={newRole}
        onChange={(e) => setNewRole(e.target.value as Role)}
        className="p-2 border rounded w-full mb-3 bg-white text-black"
      >
        <option value="staff">Staff</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleUpdateRole}
        disabled={loading || !selectedUserId}
        className={`bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-full ${
          loading || !selectedUserId ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Updating...
          </span>
        ) : (
          "Update Role"
        )}
      </button>
    </div>
  );
};

export default AdminControls;
