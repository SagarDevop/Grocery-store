import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/**
 * Firebase Client Configuration
 * Using the actual project credentials provided by the user.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBDZPu5O5l2KhkiFUTGmaOgEm1KZiDK1QY",
  authDomain: "grocery-8e986.firebaseapp.com",
  projectId: "grocery-8e986",
  storageBucket: "grocery-8e986.firebasestorage.app",
  messagingSenderId: "674686137475",
  appId: "1:674686137475:web:2c582358529728a94417b6",
  measurementId: "G-G8EZE17K81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard OAuth setup: allow one account per user
googleProvider.setCustomParameters({ prompt: 'select_account' });
