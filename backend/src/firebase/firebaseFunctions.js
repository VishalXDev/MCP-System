import functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserInFirestore = functions.auth.user().onCreate(async (user) => {
  try {
    const userRef = db.collection("users").doc(user.uid);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      await userRef.set({
        email: user.email,
        role: "user", // Default role
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ User ${user.email} added to Firestore`);
    }
  } catch (error) {
    console.error("🔥 Error creating user document:", error);
  }
});
