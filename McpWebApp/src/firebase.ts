// src/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ✅ Use environment variables for security and flexibility (especially in production)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCiBVimycNraGK_P3jAPsoYSOQ6Wnj_yV4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mcp-system-81684.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mcp-system-81684",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mcp-system-81684.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "571206938045",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:571206938045:web:3945ad78a730130cbc76d4",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z93MJFMEXV"
};

// 🔒 Ensure Firebase is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
