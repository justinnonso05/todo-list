import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvb4QtfLRYm9BXEzYp_w5hSXqRwK8xx7U",
  authDomain: "todo-list-abcd.firebaseapp.com",
  projectId: "todo-list-abcd",
  storageBucket: "todo-list-abcd.firebasestorage.app",
  messagingSenderId: "851411812404",
  appId: "1:851411812404:web:845e9026fa7a5210df0a61",
  measurementId: "G-Y4CKPZ50JS"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// DEBUG: verify runtime config
if (typeof window !== "undefined") {
  console.log("Firebase config:", firebaseConfig);
  console.log("Initialized app options:", app.options);
}

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);