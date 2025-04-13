import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// ✅ Define valid roles
export type UserRole = "admin" | "manager" | "staff";

// ✅ Admin UID from .env (must be defined)
export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

if (!ADMIN_UID) {
  console.warn("⚠️ ADMIN_UID is not defined in the environment. Role updates may fail.");
}

/**
 * 🔍 Fetch the user's role from Firestore.
 * @param uid - Firebase Auth UID
 * @returns User's role or "staff" by default
 */
export const getUserRole = async (uid: string): Promise<UserRole> => {
  if (!uid) return "staff";

  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const role = userData?.role;
      if (role === "admin" || role === "manager" || role === "staff") {
        return role;
      }
    } else {
      console.warn(`⚠️ User not found in Firestore: ${uid}`);
    }
  } catch (error) {
    console.error("🚨 Failed to fetch user role:", (error as Error).message);
  }

  return "staff";
};

/**
 * 🔐 Update a user's role in Firestore (admin only).
 * @param adminUid - UID of the current admin
 * @param uid - UID of the user whose role is being updated
 * @param newRole - New role to assign
 */
export const updateUserRole = async (
  adminUid: string,
  uid: string,
  newRole: UserRole
): Promise<void> => {
  try {
    if (!adminUid || !uid || !newRole) {
      throw new Error("Missing required parameters.");
    }

    if (adminUid !== ADMIN_UID) {
      throw new Error("Unauthorized: Only admin can update roles.");
    }

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { role: newRole });

    console.log(`✅ Role for ${uid} updated to "${newRole}"`);
  } catch (error) {
    console.error("🚨 Error updating user role:", (error as Error).message);
  }
};
