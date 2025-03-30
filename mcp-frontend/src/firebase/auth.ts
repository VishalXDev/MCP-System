import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase Configuration (Move this to .env)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Define User & Profile Interfaces
interface User {
  uid: string;
  displayName?: string;
  email?: string; // Made optional to prevent runtime issues
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

// Function to Create User Profile in Firestore
export const createUserProfile = async (user: User): Promise<void> => {
  if (!user || !user.uid || !user.email) {
    console.warn("Invalid user data. Cannot create profile.");
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
      console.log("User profile created successfully.");
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};
