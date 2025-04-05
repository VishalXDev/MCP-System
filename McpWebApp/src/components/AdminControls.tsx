import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserRole } from "../firebase/roleUtils";
import { auth } from "../firebase/firebaseConfig";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
}

// Define role type to restrict values
type Role = "admin" | "manager" | "staff";

const AdminControls = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  // Strictly typing the `newRole` state as a Role type
  const [newRole, setNewRole] = useState<Role>("staff");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users."));
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUserId) return toast.warn("Please select a user.");

    try {
      setLoading(true);
      const adminUid = auth.currentUser?.uid;
      if (!adminUid) throw new Error("Admin UID not found");

      await updateUserRole(adminUid, selectedUserId, newRole);
      toast.success("✅ Role updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update role.");
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
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <select
        value={newRole}
        onChange={(e) => setNewRole(e.target.value as Role)} // Type casting to Role
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
        {loading ? "Updating..." : "Update Role"}
      </button>
    </div>
  );
};

export default AdminControls;
