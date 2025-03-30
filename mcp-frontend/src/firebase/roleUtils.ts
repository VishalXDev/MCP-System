import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/authUtils"; // Firestore Import

// Fetch user role from Firestore
interface UserRole {
  role: string;
}

export const getUserRole = async (uid: string): Promise<UserRole['role']> => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? (docSnap.data().role as UserRole['role']) || "staff" : "staff"; // Default role
};

// Update user role (Admin only)
interface UserRoleUpdate {
  uid: string;
  newRole: string;
}

export const updateUserRole = async (uid: UserRoleUpdate['uid'], newRole: UserRoleUpdate['newRole']): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { role: newRole }, { merge: true });
};
