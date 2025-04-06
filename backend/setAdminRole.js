// src/setadminrole.js

import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env
dotenv.config();

// Required for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin with Service Account
const serviceAccount = await import(path.resolve(__dirname, process.env.FIREBASE_ADMIN_SDK_PATH));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.default || serviceAccount),
});

async function setAdminRole(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log(`✅ Admin role assigned to UID: ${uid}`);
  } catch (error) {
    console.error("🚨 Error assigning admin role:", error);
  }
}

// Replace with actual UID
setAdminRole("E6ckHzExeBWBuHvsOPBFsHQtn2t2");
