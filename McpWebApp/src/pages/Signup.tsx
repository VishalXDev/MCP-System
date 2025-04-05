import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password cannot be empty.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: role || "user",
        preferences: {
          theme: "light",
          notifications: true,
        },
        createdAt: new Date().toISOString(),
      });

      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 w-full rounded bg-gray-800 my-2 focus:ring focus:ring-blue-500 outline-none"
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 w-full rounded bg-gray-800 my-2 focus:ring focus:ring-blue-500 outline-none"
        disabled={loading}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-3 w-full rounded bg-gray-800 my-2 text-white"
        disabled={loading}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleSignup}
        disabled={loading}
        className={`w-full p-3 mt-4 rounded font-bold transition ${
          loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </div>
  );
};

export default Signup;
