
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPdVE3_R_ZsjBOZfa4bc9sMgBsLoDLlLc",
  authDomain: "alfomex.vercel.app",
  projectId: "alfomex-f4efa",
  storageBucket: "alfomex-f4efa.firebasestorage.app",
  messagingSenderId: "1090528818564",
  appId: "1:1090528818564:web:dac6cb3333a2ee443919d1",
  measurementId: "G-SW633HRXV1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
