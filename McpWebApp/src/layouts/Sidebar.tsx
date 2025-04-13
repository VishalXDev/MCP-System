// src/layouts/Sidebar.tsx
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaTachometerAlt,
  FaBox,
  FaWallet,
  FaCog,
  FaMapMarkedAlt,
  FaUsers,
} from "react-icons/fa";

const Sidebar = () => {
  const { role } = useAuth(); // 🔐 Get current user's role

  return (
    <div className="w-full h-full bg-gray-900 text-white p-5 flex flex-col">
      {/* 🅼 MCP Branding */}
      <h2 className="text-2xl font-bold mb-6 tracking-tight">MCP System</h2>

      {/* 📚 Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <ul className="space-y-2">
          {/* 🧭 Dashboard */}
          <SidebarLink to="/" icon={<FaTachometerAlt />} label="Dashboard" />

          {/* 📦 Orders */}
          {(role === "admin" || role === "pickup-partner") && (
            <SidebarLink to="/orders" icon={<FaBox />} label="Orders" />
          )}

          {/* 💸 Wallet (Pickup Partner Only) */}
          {role === "pickup-partner" && (
            <SidebarLink to="/wallet" icon={<FaWallet />} label="Wallet" />
          )}

          {/* 🗺️ Order Tracking (Pickup Partner Only) */}
          {role === "pickup-partner" && (
            <SidebarLink to="/order-tracking" icon={<FaMapMarkedAlt />} label="Order Tracking" />
          )}

          {/* ⚙️ Settings */}
          <SidebarLink to="/settings" icon={<FaCog />} label="Settings" />

          {/* 👥 Users (Admin Only) */}
          {role === "admin" && (
            <SidebarLink to="/users" icon={<FaUsers />} label="Users" />
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

// ✅ Reusable Sidebar Link Component
interface SidebarLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
}

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded space-x-3 transition text-sm font-medium ${
          isActive ? "bg-gray-700" : "hover:bg-gray-700"
        }`
      }
      aria-label={label}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  </li>
);
