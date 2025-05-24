// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPdVE3_R_ZsjBOZfa4bc9sMgBsLoDLlLc",
  authDomain: "alfomex-f4efa.firebaseapp.com",
  projectId: "alfomex-f4efa",
  storageBucket: "alfomex-f4efa.firebasestorage.app",
  messagingSenderId: "1090528818564",
  appId: "1:1090528818564:web:dac6cb3333a2ee443919d1",
  measurementId: "G-SW633HRXV1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Inicializar Firestore

export {
  auth,
  db, // ✅ Exportar Firestore
  doc,
  setDoc,
  getDoc,
  updateDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updatePassword
};
