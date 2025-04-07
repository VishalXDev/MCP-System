import { ReactNode, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: ReactNode;
  fallbackUI?: ReactNode;
}

const ProtectedRoute = ({
  allowedRoles,
  children,
  fallbackUI,
}: ProtectedRouteProps): ReactElement => {
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
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    console.warn(
      `🚫 Access denied: "${role}" not in [${allowedRoles.join(", ")}]`
    );
    return fallbackUI ? <>{fallbackUI}</> : <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
