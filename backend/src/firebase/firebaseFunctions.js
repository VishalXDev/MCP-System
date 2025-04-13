import functions from "firebase-functions";
import admin from "firebase-admin";

// Ensure app is initialized only once
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// 📌 Cloud Function: Triggered on new Firebase Auth user creation
export const createUserInFirestore = functions.auth.user().onCreate(async (user) => {
  try {
    const userRef = db.collection("users").doc(user.uid);

    const userExists = await userRef.get();
    if (!userExists.exists) {
      await userRef.set({
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        phoneNumber: user.phoneNumber || null,
        role: "user", // 🔒 Default role
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Firestore user created for: ${user.email}`);
    } else {
      console.log(`ℹ️ User already exists in Firestore: ${user.email}`);
    }
  } catch (error) {
    console.error("🔥 Error creating Firestore user document:", error);
  }
});
