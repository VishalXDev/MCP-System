import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserRole } from "../firebase/roleUtils";
import { auth } from "../firebase/firebaseConfig"; // ✅ Import Firebase auth

const AdminControls = () => {
  const [userId, setUserId] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateRole = async () => {
    if (!userId) {
      alert("Please enter a valid User ID.");
      return;
    }

    try {
      setLoading(true);
      const adminUid = auth.currentUser?.uid; // ✅ Get the current admin's UID

      if (!adminUid) {
        throw new Error("Unauthorized action: Admin UID not found.");
      }

      await updateUserRole(adminUid, userId, newRole); // ✅ Pass all 3 arguments
      alert("User role updated successfully!");
      setUserId(""); // Clear input after update

      // Redirect to the dashboard
      navigate("/dashboard");
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
        className="p-2 border rounded mb-2 w-full text-black bg-white"
      />

      <select
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        className="p-2 border rounded w-full mb-2 text-black bg-white"
      >
        <option value="staff">Staff</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleUpdateRole}
        className={`bg-red-500 hover:bg-red-700 text-black py-2 px-4 rounded ${
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
