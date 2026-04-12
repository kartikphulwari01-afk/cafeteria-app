import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvyGOXAaYgtBfF9Z_XThRJNf7u__-bgUM",
  authDomain: "cafeteria-app-81c8d.firebaseapp.com",
  projectId: "cafeteria-app-81c8d",
  storageBucket: "cafeteria-app-81c8d.firebasestorage.app",
  messagingSenderId: "948167601474",
  appId: "1:948167601474:web:74878cf6d5865b69d7ecdb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 THIS IS IMPORTANT (auth export)
export const auth = getAuth(app);