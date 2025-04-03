import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ensure correct Firebase import

// ✅ Admin UID (Ensure it's correctly set in .env)
export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

/**
 * 🔍 Fetches the user role from Firestore.
 * @param uid - User ID
 * @returns Role of the user (default: "staff")
 */
export const getUserRole = async (uid: string): Promise<string> => {
  if (!uid) return "staff"; // 🚨 Ensure UID is valid

  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData?.role ?? "staff"; // Default to "staff"
    } else {
      console.warn(`⚠ User ${uid} not found in Firestore.`);
    }
  } catch (error) {
    console.error("🚨 Error fetching user role:", (error as Error).message);
  }

  return "staff"; // 🚨 Fail-safe return
};

/**
 * 🔒 Securely updates the user role (Only Admin can update roles).
 * @param adminUid - Admin UID (current user)
 * @param uid - User ID whose role needs to be updated
 * @param newRole - New role to assign
 */
export const updateUserRole = async (adminUid: string, uid: string, newRole: string): Promise<void> => {
  try {
    if (!adminUid || !uid || !newRole) {
      throw new Error("Invalid parameters: Admin UID, User UID, and role are required.");
    }

    // 🔒 Security Check: Ensure only the Admin can update roles
    if (adminUid !== ADMIN_UID) {
      throw new Error("❌ Unauthorized: Only the admin can update roles.");
    }

    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { role: newRole }, { merge: true });
    console.log(`✅ User ${uid} role updated to "${newRole}"`);
  } catch (error) {
    console.error("🚨 Error updating user role:", (error as Error).message);
  }
};
