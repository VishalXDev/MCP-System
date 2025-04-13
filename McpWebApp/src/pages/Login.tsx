import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/axios";
import { setAuthToken } from "../utils/auth";
import axios, { AxiosError } from "axios";

type LoginCredentials = {
  email: string;
  password: string;
};

type UserRole = "admin" | "pickup-partner" | "staff";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return axiosErr.response?.data?.message || "API request failed";
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = (): boolean => {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Email and password are required.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters.");
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
      const { token, user } = res.data;

      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      const role = user?.role as UserRole;

      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "pickup-partner":
          navigate("/dashboard");
          break;
        case "staff":
          navigate("/staff");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-white"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          MCP Login
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-required="true"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="current-password"
              aria-required="true"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="text-right text-sm mb-4">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
