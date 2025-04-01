import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Ensure styles are applied
import "../app.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      console.log("🔹 Attempting login with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Login successful. UID:", user.uid);

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("📌 Firestore Data:", userData);

        if (!userData.role) {
          throw new Error("User role is missing in Firestore.");
        }

        const role = userData.role;
        console.log(`✅ User role: ${role}`);

        navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");
      } else {
        throw new Error("User document does not exist in Firestore.");
      }
    } catch (err) {
      console.error("🚨 Login error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg w-96 mx-auto mt-20 shadow-lg">
      <h2 className="text-lg font-bold text-center mb-4">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="p-2 rounded bg-gray-700 w-full my-2 focus:ring focus:ring-blue-500 outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 rounded bg-gray-700 w-full my-2 focus:ring focus:ring-blue-500 outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className={`w-full p-2 rounded ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
