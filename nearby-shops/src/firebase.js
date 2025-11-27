// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlenuILPuATeBCNiI8Lp7ie3QbPi4034c",
  authDomain: "localhunt-6b8fc.firebaseapp.com",
  projectId: "localhunt-6b8fc",
  storageBucket: "localhunt-6b8fc.appspot.com",
  messagingSenderId: "652397625916",
  appId: "1:652397625916:web:08cfa5d1e6c8b4687bf939",
  measurementId: "G-Y0CPW5MJJ4"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 🔹 Extra for mobile OTP login
export { RecaptchaVerifier, signInWithPhoneNumber };

export default app;
