// src/App.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utils & Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import socket, { connectSocket } from "./utils/socket";

// Pages
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import OrderDetails from "./pages/OrderDetails";
import WalletPage from "./pages/Wallet";
import ReportsPage from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Components
import AdminDashboard from "./components/AdminControls";
import Settings from "./components/Settings";
import OrderTracking from "./components/OrderTracking";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./components/Notifications";

// Styles
import "./App.css";
import "./index.css";

function InnerApp() {
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const token = localStorage.getItem("token");
      if (token) {
        connectSocket(token);

        socket.on("connect", () => {
          console.log("✅ Connected to WebSocket server");
        });

        socket.on("notification", (message: string) => {
          console.info("📢 Notification:", message);
        });

        return () => {
          socket.off("connect");
          socket.off("notification");
          socket.disconnect();
        };
      }
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-white">
        🔄 Authenticating...
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <Notifications />

      <Routes>
        {/* Public */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Protected */}
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
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <WalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
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

        {/* Unauthorized fallback */}
        <Route
          path="/unauthorized"
          element={
            <div className="flex items-center justify-center h-screen text-red-500 text-xl">
              🚫 Unauthorized Access
            </div>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
