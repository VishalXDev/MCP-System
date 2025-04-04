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

      if (currentUser) {
        try {
          const userRole = await getUserRole(currentUser.uid);
          setRole(userRole || "staff");
        } catch (error) {
          console.error("❌ Error fetching user role:", error);
          setRole("staff");
        }
      } else {
        setRole("staff"); // Reset on logout
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
