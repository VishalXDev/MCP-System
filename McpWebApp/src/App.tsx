import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context & Hooks
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

// Utils
import socket, { connectSocket } from "./utils/socket";

// Public Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Settings from "./components/Settings";
import WalletPage from "./pages/Wallet";
import ReportsPage from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./components/OrderTracking";
import AdminDashboard from "./components/AdminControls";
import Notifications from "./components/Notifications";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

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
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Redirect root based on role */}
        <Route
          path="/"
          element={
            user?.role === "admin" ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
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
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized & 404 */}
        <Route
          path="/unauthorized"
          element={
            <div className="flex items-center justify-center h-screen text-red-500 text-xl">
              🚫 Unauthorized Access
            </div>
          }
        />
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
