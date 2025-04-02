import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext"; // Make sure this is the correct import path

// Fetches the user's role from Firestore
export const getUserRole = async (uid: string): Promise<string> => {
  if (!uid) {
    console.error("🚨 Invalid UID provided.");
    return "staff"; // Default role if UID is invalid
  }

  try {
    console.log(`🔹 Fetching role for UID: ${uid}`);
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.warn(`⚠ No user document found for UID: ${uid}`);
      return "staff"; // Default role if document is not found
    }

    const userData = userDocSnap.data();
    if (!userData || typeof userData.role !== "string") {
      console.warn(`⚠ Role field missing or invalid for UID: ${uid}`);
      return "staff"; // Default role if role field is missing or invalid
    }

    console.log(`✅ Retrieved role: ${userData.role}`);
    return userData.role;
  } catch (error) {
    console.error("🚨 Error fetching user role:", error);
    return "staff"; // Default role on error
  }
};

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, loading, setRole, role } = useAuth(); // Use role and setRole from AuthContext

  useEffect(() => {
    if (user && !role) { // Only fetch role if the user is logged in and role is not already set
      const fetchRole = async () => {
        const userRole = await getUserRole(user.uid);
        setRole(userRole); // Update role in context
      };

      fetchRole();
    }
  }, [user, role, setRole]); // Effect depends on user and role

  // Show loading state while user's data is being fetched
  if (loading || !role) {
    return <div>Loading...</div>;
  }

  // If the user isn't authenticated or doesn't have the correct role, redirect them
  if (!user || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Render the protected children if the user is authorized
  return <>{children}</>;
};
