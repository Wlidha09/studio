
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "hresource-42xov",
  "appId": "1:591491822516:web:b0f99c158ffd35179f78e1",
  "storageBucket": "hresource-42xov.firebasestorage.app",
  "apiKey": "AIzaSyBjvNMOaxQNE3UWQq9t7Vlu_ycNhqofilY",
  "authDomain": "hresource-42xov.web.app",
  "measurementId": "",
  "messagingSenderId": "591491822516"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
