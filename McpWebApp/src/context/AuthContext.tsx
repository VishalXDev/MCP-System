// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";

interface AuthUser {
  uid: string;
  email: string | null;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          let role = "user";

          if (userDoc.exists()) {
            role = userDoc.data().role || "user";
          } else {
            const idToken = await firebaseUser.getIdToken();
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/auth/role`,
              {
                headers: { Authorization: `Bearer ${idToken}` },
              }
            );
            role = res.data.role || "user";
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role,
          });
        } catch (err) {
          console.error("Error getting user role:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
