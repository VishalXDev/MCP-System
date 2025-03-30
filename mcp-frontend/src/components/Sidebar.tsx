import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold">MCP System</h2>
      <nav className="mt-5">
        <ul className="space-y-3">
          <li>
            <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/wallet"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Wallet
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/settings" className="text-gray-300 hover:text-white">
              Settings
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/order-tracking"
              className="text-gray-300 hover:text-white"
            >
              Order Tracking
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
