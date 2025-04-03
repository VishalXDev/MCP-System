import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTachometerAlt, FaBox, FaWallet, FaCog, FaMapMarkedAlt } from "react-icons/fa";

const Sidebar = () => {
  const { role } = useAuth(); // Get user role from AuthContext

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 flex flex-col">
      {/* MCP System Branding */}
      <h2 className="text-xl font-bold mb-5">MCP System</h2>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded space-x-2 ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
              aria-label="Dashboard"
            >
              <FaTachometerAlt /> <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Orders (Only for Admin & Pickup Partners) */}
          {(role === "admin" || role === "pickup-partner") && (
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded space-x-2 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                aria-label="Orders"
              >
                <FaBox /> <span>Orders</span>
              </NavLink>
            </li>
          )}

          {/* Wallet (Only for Pickup Partners) */}
          {role === "pickup-partner" && (
            <li>
              <NavLink
                to="/wallet"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded space-x-2 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                aria-label="Wallet"
              >
                <FaWallet /> <span>Wallet</span>
              </NavLink>
            </li>
          )}

          {/* Order Tracking (Only for Pickup Partners) */}
          {role === "pickup-partner" && (
            <li>
              <NavLink
                to="/order-tracking"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded space-x-2 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                aria-label="Order Tracking"
              >
                <FaMapMarkedAlt /> <span>Order Tracking</span>
              </NavLink>
            </li>
          )}

          {/* Settings (Visible to all) */}
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded space-x-2 ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
              aria-label="Settings"
            >
              <FaCog /> <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
