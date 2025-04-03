import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth(); // Get user details from context

  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      {/* ✅ Brand Name */}
      <h1 className="text-lg font-semibold">MCP System</h1>

      {/* ✅ Action Icons */}
      <div className="flex items-center space-x-4">
        {/* 🔔 Notification Icon */}
        <button className="p-2 rounded hover:bg-gray-700 transition">
          🔔
        </button>

        {/* ✅ User Profile Section */}
        <div className="relative group">
          {/* Profile Image or Placeholder */}
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Profile"
              className="w-8 h-8 rounded-full border border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              👤
            </div>
          )}

          {/* 🟢 Profile Dropdown (Future Feature) */}
          <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-sm rounded shadow-md hidden group-hover:block">
            <div className="p-2 border-b border-gray-600">{user?.displayName || "Guest"}</div>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-600">Settings</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-600">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
