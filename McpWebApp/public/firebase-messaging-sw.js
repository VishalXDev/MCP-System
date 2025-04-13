importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCiBVimycNraGK_P3jAPsoYSOQ6Wnj_yV4",
  authDomain: "mcp-system-81684.firebaseapp.com",
  projectId: "mcp-system-81684",
  storageBucket: "mcp-system-81684.firebasestorage.app",
  messagingSenderId: "571206938045",
  appId: "1:571206938045:web:bfebcab33f7dec46bc76d4",
  measurementId: "G-PXBRNJZWXP",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
