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
        email: user.email,
        role: role || "user", // Ensure role is always set
        uid: user.uid,
      });
      

      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-96 mx-auto mt-16">
      <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <input
        type="email"
        placeholder="Email"
        className="p-3 rounded bg-gray-800 w-full my-2 focus:ring focus:ring-blue-500 outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        className="p-3 rounded bg-gray-800 w-full my-2 focus:ring focus:ring-blue-500 outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <select
        className="p-3 rounded bg-gray-800 w-full my-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        disabled={loading}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        className={`w-full p-3 rounded font-bold ${loading ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"}`}
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </div>
  );
};

export default Signup;
