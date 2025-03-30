import { useState } from "react";
import { updateUserRole } from "../firebase/roleUtils";

const UserTable = ({ users }) => {
  const [selectedRoles, setSelectedRoles] = useState({});

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleUpdateRole = async (userId) => {
    if (!selectedRoles[userId]) return;
    await updateUserRole(userId, selectedRoles[userId]);
    alert("User role updated!");
  };

  return (
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
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Update Role
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center p-3">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
