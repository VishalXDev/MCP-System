import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserRole } from "../firebase/roleUtils";

interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("staff"); // Default role
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser && !role) { // Only fetch role if user exists and role isn't set
        try {
          const userRole = await getUserRole(currentUser.uid);
          setRole(userRole || "staff");
        } catch (error) {
          console.error("❌ Error fetching user role:", error);
          setRole("staff");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]); // Depend on role to prevent redundant fetches

  // 🛠️ Memoize context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({ user, role, loading, setRole }), [user, role, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("❌ useAuth must be used within an AuthProvider");
  }
  return context;
};
