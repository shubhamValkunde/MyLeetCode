import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJglACSr4IrotXfSHMH3k3NJvpBucjlh0",
  authDomain: "chedotech-85bbf.firebaseapp.com",
  databaseURL:
    "https://chedotech-85bbf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chedotech-85bbf",
  storageBucket: "chedotech-85bbf.appspot.com",
  messagingSenderId: "25684933602",
  appId: "1:25684933602:web:dec0eb4d1b7949631657bb",
  measurementId: "G-0JBW8TYGFS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Export Firestore functions
export { db, collection, addDoc, getDocs, doc, updateDoc };
