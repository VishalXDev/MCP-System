import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import OrderDetails from "./pages/OrderDetails";
import NotFound from "./pages/NotFound";
import WalletPage from "./pages/Wallet";
import ReportsPage from "./pages/Reports";

// Components
import AdminDashboard from "./components/AdminControls";
import Settings from "./components/Settings";
import OrderTracking from "./components/OrderTracking";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./components/Notifications";

// Context
import { AuthProvider } from "./context/AuthContext";

// Styles
import "./App.css";
import "./index.css";

// Initialize WebSocket connection
const socket: Socket = io("http://localhost:5000");

function App() {
  useEffect(() => {
    socket.on("notification", (message: string) => {
      toast.info(message || "📢 New Notification!");
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={4000} />
      <Notifications />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
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

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
