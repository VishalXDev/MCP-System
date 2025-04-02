const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path-to-your-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminRole(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log(`✅ Admin role assigned to UID: ${uid}`);
  } catch (error) {
    console.error("🚨 Error assigning admin role:", error);
  }
}

// Replace with actual Firebase UID
setAdminRole("E6ckHzExeBWBuHvsOPBFsHQtn2t2");
