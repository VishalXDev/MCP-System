// Ensure this file exports the required Firebase services
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCiBVimycNraGK_P3jAPsoYSOQ6Wnj_yV4",
    authDomain: "mcp-system-81684.firebaseapp.com",
    projectId: "mcp-system-81684",
    storageBucket: "mcp-system-81684.firebasestorage.app",
    messagingSenderId: "571206938045",
    appId: "1:571206938045:web:3945ad78a730130cbc76d4",
    measurementId: "G-Z93MJFMEXV"  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { db, auth, storage };