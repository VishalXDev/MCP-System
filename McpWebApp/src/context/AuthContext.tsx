// src/context/AuthContext.tsx
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  FC,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  uid: string | null;
  role: string | null;
  loading: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider implementation
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRole(userData.role ?? null);
          } else {
            console.warn("⚠️ User document not found in Firestore");
            setRole(null);
          }
        } catch (error) {
          console.error("❌ Error fetching user role:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      uid: user?.uid ?? null,
      role,
      loading,
    }),
    [user, role, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.displayName = "AuthProvider";
