import { useState } from "react";
import { updateUserRole } from "../firebase/roleUtils";

const AdminControls = () => {
  const [userId, setUserId] = useState("");
  const [newRole, setNewRole] = useState("staff");

  const handleUpdateRole = async () => {
    if (!userId) return;
    await updateUserRole(userId, newRole);
    alert("User role updated!");
  };

  return (
    <div className="mt-4 p-4 border border-red-500 rounded">
      <h3 className="text-red-500 font-bold">Admin Controls</h3>

      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="p-2 border rounded mb-2"
      />

      <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="p-2 border rounded">
        <option value="staff">Staff</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleUpdateRole} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded ml-2">
        Update Role
      </button>
    </div>
  );
};

export default AdminControls;
