import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Firebase configuration (Use import.meta.env for Vite compatibility)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app & services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // 🔥 Fix: Add auth
const db = getFirestore(app);

/**
 * Fetch user role from Firestore.
 * @param uid User ID
 * @returns User role (default: "staff" if not found)
 */
export const getUserRole = async (uid: string): Promise<string> => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData?.role ?? "staff"; // Default to "staff"
    }
    return "staff";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "staff"; // Fail-safe role assignment
  }
};

/**
 * Update user role (Admin only).
 * @param uid User ID
 * @param newRole New role to assign
 */
export const updateUserRole = async (uid: string, newRole: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { role: newRole }, { merge: true });
    console.log(`User ${uid} role updated to ${newRole}`);
  } catch (error) {
    console.error("Error updating user role:", error);
  }
};

// Export Firebase instances
export { app, auth, db }; // 🔥 Fix: Export auth
