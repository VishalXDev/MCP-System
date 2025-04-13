import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ Correct casing
import type { AuthContextType } from "../types/auth";

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext) as AuthContextType;
};
