import ProtectedRoute from "../components/ProtectedRoute";
import UserTable from "../components/UserTable";

const Users = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">User Management</h2>
        <UserTable />
      </div>
    </ProtectedRoute>
  );
};

export default Users;
