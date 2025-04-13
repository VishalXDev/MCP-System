// src/config/firebaseConfig.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Validate required env vars
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
];

for (const key of requiredEnvVars) {
  if (!import.meta.env[key]) {
    throw new Error(`Missing Firebase env variable: ${key}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_FIREBASE_APP_ID!,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID!,
};

// Prevent reinitialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
