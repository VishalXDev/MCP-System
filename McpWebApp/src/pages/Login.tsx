import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/axios.ts";
import { setAuthToken } from "../utils/auth.ts";
import axios from "axios";

type LoginCredentials = {
  email: string;
  password: string;
};

type UserRole = "admin" | "pickup-partner" | "staff";

const getErrorMessage = (error: unknown): string => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const res = await API.post("/auth/login", credentials);
      setAuthToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role as UserRole;
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      console.error("Login failed:", err);
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
          MCP Admin Login
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
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
