// js/modulos/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPdVE3_R_ZsjBOZfa4bc9sMgBsLoDLlLc",
  authDomain: "alfomex-f4efa.firebaseapp.com",
  projectId: "alfomex-f4efa",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window.auth = auth;
