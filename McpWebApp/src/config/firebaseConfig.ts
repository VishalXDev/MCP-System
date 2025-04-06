// src/config/firebaseConfig.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Ensure all required environment variables are present
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
] as const;

const firebaseConfig: Record<string, string> = {};

for (const key of requiredEnvVars) {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing Firebase env variable: ${key}`);
  }
  firebaseConfig[key.replace("VITE_FIREBASE_", "").toLowerCase()] = value;
}

// Prevent re-initialization during hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export initialized Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
