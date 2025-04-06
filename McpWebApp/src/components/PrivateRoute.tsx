// src/routes/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";
// import Spinner from "../components/Spinner"; // Optional custom loader

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional: restrict access by role
  fallbackUI?: ReactNode;  // Optional: fallback for unauthorized access
}

const PrivateRoute = ({
  children,
  allowedRoles,
  fallbackUI,
}: PrivateRouteProps): JSX.Element => {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
    // return <Spinner />; // Optional custom loader
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return fallbackUI ? (
      <>{fallbackUI}</>
    ) : (
      <div className="text-center text-red-500 mt-10">
        You do not have permission to view this page.
      </div>
    );
    // Or: return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
