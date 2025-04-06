// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: ReactNode;
  fallbackUI?: ReactNode; // Optional fallback for unauthorized users
}

const ProtectedRoute = ({
  allowedRoles,
  children,
  fallbackUI,
}: ProtectedRouteProps): JSX.Element => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  if (!user) {
    console.warn("🔐 Redirecting: User not logged in.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(
      `🚫 Access denied: Role "${role}" not in [${allowedRoles.join(", ")}]`
    );
    return fallbackUI ? (
      <>{fallbackUI}</>
    ) : (
      <Navigate to="/unauthorized" replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
