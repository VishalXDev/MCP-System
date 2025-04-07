import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // ✅ Correct import path

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: ReactNode;
  fallbackUI?: ReactNode;
}

const ProtectedRoute = ({
  allowedRoles,
  children,
  fallbackUI,
}: ProtectedRouteProps): ReactNode => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        🔐 Checking permissions...
      </div>
    );
  }

  if (!user) {
    console.warn("🚫 Redirect: User not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    console.warn(`🚫 Access denied: "${role}" not in [${allowedRoles.join(", ")}]`);
    return fallbackUI ? (
      <>{fallbackUI}</>
    ) : (
      <Navigate to="/unauthorized" replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
