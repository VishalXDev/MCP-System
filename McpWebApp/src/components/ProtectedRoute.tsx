import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth"; // ✅


// Fetch user role from Firestore
const getUserRole = async (uid: string): Promise<string> => {
  if (!uid) {
    console.error("🚨 Invalid UID provided.");
    return "staff";
  }

  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.warn(`⚠ No user document found for UID: ${uid}`);
      return "staff";
    }

    const userData = userDocSnap.data();
    return userData?.role && typeof userData.role === "string" ? userData.role : "staff";
  } catch (error) {
    console.error("🚨 Error fetching user role:", error);
    return "staff";
  }
};

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, loading, setRole, role } = useAuth();
  const [roleLoading, setRoleLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user && !role) {
      setRoleLoading(true);
      getUserRole(user.uid)
        .then(setRole)
        .finally(() => setRoleLoading(false));
    } else {
      setRoleLoading(false);
    }
  }, [user, role, setRole]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        <span className="ml-3">Checking access...</span>
      </div>
    );
  }

  if (!user) {
    console.warn("🚨 Unauthorized access: Redirecting to login.");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    console.warn(`🚨 Access denied for role: ${role}. Allowed roles: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
