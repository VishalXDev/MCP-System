import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "New User",
      email: user.email,
      role: "staff", // Default role
      preferences: { theme: "light", notifications: true },
    });
  }
};
