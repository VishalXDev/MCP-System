// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

export interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); // ✅ Exported here

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/role`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          setRole(res.data.role);
        } catch (error) {
          console.error("Failed to fetch role:", error);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
