import { createContext, useEffect, useState, ReactNode, useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserRole } from "../firebase/roleUtils";

interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
  setRole: (role: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("staff");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRole = await getUserRole(currentUser.uid);
          setRole(userRole || "staff");
        } catch (error) {
          console.error("❌ Error fetching user role:", error);
          setRole("staff");
        }
      } else {
        setRole("staff");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = useMemo(() => ({ user, role, loading, setRole }), [user, role, loading]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
