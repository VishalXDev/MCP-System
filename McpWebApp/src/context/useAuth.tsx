// src/context/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Custom hook to access the authenticated user context.
 *
 * @returns {AuthContextType} The auth context value.
 * @throws {Error} If used outside of <AuthProvider>.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("❌ useAuth must be used within an <AuthProvider>.");
  }

  return context;
};
