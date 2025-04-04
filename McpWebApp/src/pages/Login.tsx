import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/axios.ts";
import axios from "axios";
import { setAuthToken } from "../utils/auth.ts";

type LoginCredentials = {
  email: string;
  password: string;
};

type UserRole = "admin" | "pickup-partner" | "staff";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "Account disabled";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later";
      default:
        console.warn("Unhandled Firebase error:", error.code);
        return "Authentication failed. Please try again.";
    }
  }
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "API request failed";
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"firebase" | "api">("api");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = (): boolean => {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Email and password are required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleFirebaseLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        throw new Error("User account not found");
      }

      const userData = userDoc.data();
      const role = userData?.role as UserRole;

      const routes: Record<UserRole, string> = {
        admin: "/admin-dashboard",
        "pickup-partner": "/partner-dashboard",
        staff: "/dashboard",
      };

      navigate(routes[role] || "/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(getErrorMessage(err));
    }
  };

  const handleApiLogin = async () => {
    try {
      const res = await API.post("/auth/login", credentials);
      setAuthToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      const role = res.data.user?.role as UserRole | undefined;
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      console.error("API error:", err);
      setError(getErrorMessage(err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    setLoading(true);

    try {
      if (authMethod === "firebase") {
        await handleFirebaseLogin();
      } else {
        await handleApiLogin();
      }
    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {authMethod === "firebase" ? "Firebase Login" : "API Login"}
        </h1>

        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setAuthMethod("api")}
            className={`px-4 py-2 rounded-l-lg ${
              authMethod === "api" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            API Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("firebase")}
            className={`px-4 py-2 rounded-r-lg ${
              authMethod === "firebase" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Firebase Login
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;