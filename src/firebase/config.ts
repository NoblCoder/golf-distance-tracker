/** @format */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
// IMPORTANT: These are PLACEHOLDER values only. Not real secrets.
// To enable cloud sync, create a .env file with your actual Firebase config.
// See .env.example for setup instructions.
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY || "PLACEHOLDER-NOT-A-REAL-KEY",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "placeholder-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "placeholder-project.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID || "0:000000000000:web:placeholder",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
