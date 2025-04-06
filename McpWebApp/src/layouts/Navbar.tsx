import { useAuth } from "../hooks/useAuth"; // ✅ Correct location
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth"; // or "../firebase" if using index export
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth(); // 🔐 Get user from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ User signed out");
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", (error as Error).message);
    }
  };

  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      {/* ✅ App Brand */}
      <h1 className="text-lg font-semibold">MCP System</h1>

      {/* ✅ Right Actions */}
      <div className="flex items-center space-x-4">
        {/* 🔔 Notification */}
        <button
          className="p-2 rounded hover:bg-gray-700 transition"
          aria-label="Notifications"
        >
          🔔
        </button>

        {/* ✅ Profile with Dropdown */}
        <div className="relative group">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User"
              className="w-8 h-8 rounded-full border border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              👤
            </div>
          )}

          {/* ⬇️ Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-sm rounded shadow-md hidden group-hover:block group-focus-within:block z-50">
            <div className="p-2 border-b border-gray-600 text-white">
              {user?.displayName || "Guest"}
            </div>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-600">Settings</button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
