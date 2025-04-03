import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // 🚀 Smooth animations

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      console.log("🔹 Attempting login with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Login successful. UID:", user.uid);

      // ✅ Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error("User not found in Firestore.");

      const userData = userDoc.data();
      const role = (userData?.role as "admin" | "pickup-partner" | "staff") || "staff"; // ✅ Type assertion applied
      console.log(`✅ User role: ${role}`);

      // ✅ Role-based navigation with strict types
      const roleRoutes: Record<"admin" | "pickup-partner" | "staff", string> = {
        admin: "/admin-dashboard",
        "pickup-partner": "/partner-dashboard",
        staff: "/dashboard",
      };

      navigate(roleRoutes[role] || "/dashboard");
    } catch (err) {
      console.error("🚨 Login error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-900 text-white rounded-lg w-96 mx-auto mt-20 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-bold text-center mb-4">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="p-2 rounded bg-gray-800 w-full my-2 focus:ring focus:ring-blue-500 outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 rounded bg-gray-800 w-full my-2 focus:ring focus:ring-blue-500 outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className={`w-full p-2 rounded transition ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </motion.div>
  );
};

export default Login;
