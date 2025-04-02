import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold">MCP System</h2>
      <nav className="mt-5">
        <ul className="space-y-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
              aria-label="Dashboard"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
              aria-label="Orders"
            >
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/wallet"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
              aria-label="Wallet"
            >
              Wallet
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
              aria-label="Settings"
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/order-tracking"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
              aria-label="Order Tracking"
            >
              Order Tracking
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
