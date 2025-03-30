import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCiBVimycNraGK_P3jAPsoYSOQ6Wnj_yV4",
    authDomain: "mcp-system-81684.firebaseapp.com",
    projectId: "mcp-system-81684",
    storageBucket: "mcp-system-81684.firebasestorage.app",
    messagingSenderId: "571206938045",
    appId: "1:571206938045:web:3945ad78a730130cbc76d4",
    measurementId: "G-Z93MJFMEXV"  
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
