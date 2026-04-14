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

// Diagnostic Mode: Log masked config on client to verify build variables
if (typeof window !== "undefined") {
  const maskedKey = firebaseConfig.apiKey 
    ? `${firebaseConfig.apiKey.substring(0, 6)}...${firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 4)}`
    : 'MISSING';
    
  console.log("🔥 Firebase Config Diagnostic:", {
    apiKey: maskedKey,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    isInitialized: !!app
  });

  // Ensure persistence is set
  setPersistence(auth, browserLocalPersistence).catch(err => {
    console.error("Firebase Persistence Error:", err);
  });
}

export default app;