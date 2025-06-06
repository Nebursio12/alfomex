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
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔧 CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDPdVE3_R_ZsjBOZfa4bc9sMgBsLoDLlLc",
  authDomain: "alfomex-f4efa.firebaseapp.com",
  projectId: "alfomex-f4efa",
  storageBucket: "alfomex-f4efa.firebasestorage.app",
  messagingSenderId: "1090528818564",
  appId: "1:1090528818564:web:dac6cb3333a2ee443919d1",
  measurementId: "G-SW633HRXV1"
};

// 🔧 INICIALIZACIÓN
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ FUNCIONES PERSONALIZADAS

async function guardarUsuarioEnFirestore(user) {
  const ref = doc(db, "usuarios", user.uid);
  await setDoc(ref, {
    nombre: user.displayName || "",
    correo: user.email,
    foto: user.photoURL || "",
    proveedor: user.providerData[0]?.providerId || "google",
    uid: user.uid,
  }, { merge: true });
}

async function loginConGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await guardarUsuarioEnFirestore(result.user);
  return result.user;
}

// ✅ EXPORTAMOS TODO LO NECESARIO
export {
  auth,
  db,
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
  updatePassword,
};
