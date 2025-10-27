// lib/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Sign in with email/password
export const signInWithEmail = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth as Auth, email, password);
  await upsertEmailUser(res.user);
  return res;
};

// Create account with email/password
export const signUpWithEmail = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth as Auth, email, password);
  await upsertEmailUser(res.user);
  return res;
};

// Sign out
export const signOutUser = async () => {
  return await signOut(auth as Auth);
};

// Auth state listener
export const onAuthStateChangedListener = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth as Auth, callback);
};

export type { FirebaseUser };

async function upsertEmailUser(user: FirebaseUser | null) {
  if (!user || !user.uid) return;
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      email: user.email ?? null,
      lastSeen: serverTimestamp(),
    },
    { merge: true }
  );
}
