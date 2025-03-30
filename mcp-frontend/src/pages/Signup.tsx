import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const db = getFirestore();

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin">("user"); // Restrict role to valid values
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        throw new Error("Email and password cannot be empty.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
        uid: user.uid,
      });

      setSuccess("Signup successful! You can now log in.");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Signup</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <input
        type="email"
        placeholder="Email"
        className="p-2 rounded bg-gray-700 w-full my-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 rounded bg-gray-700 w-full my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <select
        className="p-2 rounded bg-gray-700 w-full my-2"
        value={role}
        onChange={(e) => setRole(e.target.value as "user" | "admin")}
        disabled={loading}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        className="bg-green-500 px-4 py-2 rounded w-full font-bold hover:bg-green-600 disabled:bg-gray-500"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Signing up..." : "Signup"}
      </button>
    </div>
  );
};

export default Signup;
