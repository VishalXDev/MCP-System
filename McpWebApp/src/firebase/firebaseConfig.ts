// src/firebase/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Firebase Configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Prevent multiple app instances
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔥 Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ User & Profile Types
interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

// ✅ Function: Create Firestore user profile on first login
export const createUserProfile = async (user: User): Promise<void> => {
  if (!user?.uid || !user?.email) {
    console.warn("⚠️ Invalid user data. Cannot create profile.");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const newUserProfile: UserProfile = {
        name: user.displayName || "New User",
        email: user.email,
        role: "staff", // Default role
        preferences: { theme: "light", notifications: true },
      };

      await setDoc(userRef, newUserProfile);
      console.log("✅ User profile created.");
    } else {
      console.log("ℹ️ User profile already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating user profile:", error);
  }
};
