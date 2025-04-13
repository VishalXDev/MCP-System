// src/types/auth.ts
import { User } from "firebase/auth";

// ✅ No custom AuthUser anymore – use Firebase's User type
export interface AuthContextType {
  user: User | null;
  role: "admin" | "partner" | "pickup-partner" | "user" | null;
  loading: boolean;
}
