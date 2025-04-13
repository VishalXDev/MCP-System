import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

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
        role,
        createdAt: new Date().toISOString(),
        preferences: { theme: "light", notifications: true },
      });

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          setError("🚫 This email is already registered. Please log in instead.");
        } else {
          setError(`⚠️ ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`⚠️ ${err.message}`);
      } else {
        setError("⚠️ An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 w-full rounded bg-gray-800 my-2"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 w-full rounded bg-gray-800 my-2"
        disabled={loading}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-3 w-full rounded bg-gray-800 my-2"
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
      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
};

export default Signup;
