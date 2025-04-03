import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./components/AdminControls";
import Settings from "./components/Settings";
import OrderTracking from "./components/OrderTracking";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import OrderDetails from "./pages/OrderDetails";
import { AuthProvider } from "./context/AuthContext";
import Notifications from "./components/Notifications"; // ✅ Add Notifications component

import "./App.css";
import "./index.css";

// ✅ Initialize WebSocket connection (update with backend URL)
const socket = io("http://localhost:5000");

function App() {
  useEffect(() => {
    socket.on("notification", (message) => {
      alert(message); // Replace with a toast notification system
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <AuthProvider>
      <Notifications /> {/* ✅ Display real-time notifications */}
      <Routes>
        {/* 🆓 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Routes (User & Admin) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Admin Only Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrderManagement />
            </ProtectedRoute>
          }
        />

        {/* 🛒 Order Details (Dynamic Route) */}
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* ⚠️ 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
