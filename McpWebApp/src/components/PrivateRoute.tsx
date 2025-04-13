import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallbackUI?: ReactNode;
}

const PrivateRoute = ({
  children,
  allowedRoles,
  fallbackUI,
}: PrivateRouteProps): ReactNode => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role ?? "")) {
    return fallbackUI ? (
      <>{fallbackUI}</>
    ) : (
      <div className="text-center text-red-500 mt-10">
        You do not have permission to view this page.
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
