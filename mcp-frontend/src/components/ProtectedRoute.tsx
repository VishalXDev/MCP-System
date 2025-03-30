import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const authContext = useAuth();

  // Handle cases where auth context is still loading
  if (!authContext) return <div>Loading...</div>;

  const { user, role } = authContext;

  // Redirect if user is not logged in
  if (!user) return <Navigate to="/login" />;

  // Redirect if user's role is not allowed
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return <>{children}</>;
};

export default ProtectedRoute;
