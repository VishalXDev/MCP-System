import { useState } from "react";
import { updateUserRole } from "../firebase/roleUtils";

const AdminControls = () => {
  const [userId, setUserId] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!userId) {
      alert("Please enter a valid User ID.");
      return;
    }

    try {
      setLoading(true);
      await updateUserRole(userId, newRole);
      alert("User role updated successfully!");
      setUserId(""); // Clear input after update
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-red-500 rounded">
      <h3 className="text-red-500 font-bold">Admin Controls</h3>

      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="p-2 border rounded mb-2 w-full"
      />

      <select
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      >
        <option value="staff">Staff</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleUpdateRole}
        className={`bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded ${
          loading || !userId ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading || !userId}
      >
        {loading ? "Updating..." : "Update Role"}
      </button>
    </div>
  );
};

export default AdminControls;
