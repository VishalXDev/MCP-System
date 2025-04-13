import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { createUserProfile } from "./firebaseConfig";

/**
 * Registers a user with email and password, and creates a profile in Firestore.
 * @param email - User email.
 * @param password - User password.
 * @param name - Display name for the new user.
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (userCredential.user) {
    await createUserProfile({
      uid: userCredential.user.uid,
      email: userCredential.user.email || undefined,
      displayName: name,
    });
  }

  return userCredential;
};

/**
 * Logs in an existing user using email and password.
 * @param email - User email.
 * @param password - User password.
 */
export const loginUser = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the current authenticated user.
 */
export const logoutUser = (): Promise<void> => {
  return signOut(auth);
};
