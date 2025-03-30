import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "./firebaseConfig"; // Correct Firebase import

export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

/**
 * Fetches the user role from Firestore.
 * @param uid - User ID
 * @returns Role of the user (default: "staff")
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
 * Updates the user role (Admin only).
 * @param uid - User ID
 * @param newRole - New role to assign
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
