import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserRole } from "../firebase/roleUtils";

interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
  setRole: (role: string) => void; // Add setRole to update the role
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("staff"); // Default role is "staff"
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRole = await getUserRole(currentUser.uid); // Fetch role from Firestore
          setRole(userRole || "staff"); // Default to "staff" if no role found
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("staff");
        }
      }
      setLoading(false); // Mark loading as false once user data is processed
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
