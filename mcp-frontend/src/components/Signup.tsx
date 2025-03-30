import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const db = getFirestore();

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role: user
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        uid: user.uid,
      });

      alert("Signup successful!");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-lg font-bold">Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="p-2 rounded bg-gray-700 w-full my-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 rounded bg-gray-700 w-full my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select className="p-2 rounded bg-gray-700 w-full my-2" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button className="bg-green-500 px-4 py-2 rounded" onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
};

export default Signup;
