import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Normalizes environment variables to prevent common production issues:
 * 1. Leading/trailing whitespace
 * 2. Accidentally included quotes (e.g. from Vercel UI)
 * 3. Ghost "undefined" strings
 */
const normalize = (val: string | undefined) => {
  if (!val || val === "undefined") return "";
  return val.trim().replace(/^["'](.+)["']$/, '$1');
};

const firebaseConfig = {
  apiKey: normalize(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: normalize(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: normalize(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: normalize(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: normalize(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: normalize(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

// Singleton initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Explicitly set persistence to local to ensure session survivors across reloads/proxies
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(console.error);
}

export default app;