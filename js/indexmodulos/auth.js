// js/firebase/auth.js
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  EmailAuthProvider,
  linkWithCredential
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  doc,
  setDoc,
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { auth, db } from "./config.js";

// Estado de registro
let modoRegistro = false;
let yaVerificado = false;

// Actualizar nav según estado de sesión
onAuthStateChanged(auth, (user) => {
  const nav = document.getElementById("navOptions");
  nav.innerHTML = user
    ? `
    <button onclick="location.href='perfil.html'" title="Perfil" class="icon-btn btn-perfil">
      <i class="fas fa-user-circle"></i>
    </button>
    <button onclick="cerrarSesion()" title="Cerrar sesión" class="icon-btn btn-logout">
      <i class="fas fa-sign-out-alt"></i>
    </button>
  `
    : `<button onclick="abrirModal()">Entrar</button>`;
});

// Iniciar sesión
window.iniciarSesion = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";
  errorMsg.classList.remove("error-anim", "red", "green");

  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    window.location.reload();
  } catch {
    errorMsg.classList.add("error-anim", "red");
    errorMsg.textContent = "Correo o contraseña incorrectos.";
  }
};

// Recuperación de contraseña
window.mostrarRecuperacion = () => {
  document.getElementById("recuperacion").style.display = "block";
};

window.enviarRecuperacion = async () => {
  const correo = document.getElementById("emailRecuperar").value;
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";
  errorMsg.classList.remove("error-anim", "red", "green");

  try {
    const methods = await fetchSignInMethodsForEmail(auth, correo);
    if (methods.length === 0) {
      errorMsg.classList.add("error-anim", "red");
      errorMsg.textContent = "Este correo no está registrado.";
      return;
    }

    await sendPasswordResetEmail(auth, correo);
    errorMsg.classList.add("error-anim", "green");
    errorMsg.textContent = "Se envió el enlace al correo.";
  } catch (error) {
    errorMsg.classList.add("error-anim", "red");
    errorMsg.textContent = "Error: " + error.message;
  }
};

// Cerrar sesión
window.cerrarSesion = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

// Cambiar entre login y registro
window.toggleFormulario = (forzarModo = null) => {
  if (forzarModo !== null) {
    modoRegistro = forzarModo;
  } else {
    modoRegistro = !modoRegistro;
  }

  document.getElementById("recuperacion").style.display = "none";
  document.getElementById("emailRecuperar").value = "";

  document.getElementById("modalTitle").textContent = modoRegistro ? "Registro" : "Entrar";
  document.getElementById("submitBtn").textContent = modoRegistro ? "Registrarse" : "Entrar";
  document.querySelector('[onclick="toggleFormulario()"]').textContent =
    modoRegistro ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate";

  document.getElementById("errorMsg").textContent = "";

  document.getElementById("formLogin").classList.toggle("active", !modoRegistro);
  document.getElementById("formLogin").classList.toggle("out", modoRegistro);
  document.getElementById("formRegister").classList.toggle("active", modoRegistro);
  document.getElementById("formRegister").classList.toggle("out", !modoRegistro);
};

// Enviar formulario
document.getElementById("submitBtn").addEventListener("click", async () => {
  const errorMsg = document.getElementById("errorMsg");
  errorMsg.textContent = "";

  if (modoRegistro) {
    const nombre = document.getElementById("nombreRegistro").value.trim();
    const apellido = document.getElementById("apellidoRegistro").value.trim();
    const telefono = document.getElementById("telefonoRegistro").value.trim();
    const correo = document.getElementById("registroEmail").value.trim();
    const password = document.getElementById("registroPassword").value;

    if (!nombre || !apellido || !correo || !password || !telefono) {
      errorMsg.textContent = "Completa todos los campos.";
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      errorMsg.textContent = "El número telefónico debe tener 10 dígitos.";
      return;
    }

    if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(correo)) {
      errorMsg.textContent = "Ingresa un correo electrónico válido.";
      return;
    }

    try {
      const metodosCorreo = await fetchSignInMethodsForEmail(auth, correo);
      if (metodosCorreo.length > 0) {
        errorMsg.textContent = "Este correo ya está registrado.";
        return;
      }

      const res = await fetch("https://backend-1pvf.onrender.com/validar-registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, telefono: "+52" + telefono })
      });
      const data = await res.json();

      if (data.correoUsado) {
        errorMsg.textContent = "Este correo ya está registrado.";
        return;
      }
      if (data.telefonoUsado) {
        errorMsg.textContent = "Este número de teléfono ya está registrado.";
        return;
      }

      const resBloqueo = await fetch("https://backend-1pvf.onrender.com/verificar-sms-bloqueo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono: "+52" + telefono })
      });

      const bloqueoData = await resBloqueo.json();

      if (!resBloqueo.ok) {
        if (resBloqueo.status === 429) {
          const s = bloqueoData.segundosFaltantes;
          errorMsg.textContent = s
            ? `⏳ Espera ${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")} antes de intentarlo.`
            : "⏳ Espera unos minutos antes de volver a intentar.";
        } else if (resBloqueo.status === 403) {
          errorMsg.textContent = "Este número ya está registrado.";
        } else {
          errorMsg.textContent = "No se puede enviar el código en este momento.";
        }
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => console.log("reCAPTCHA resuelto"),
        });
        await window.recaptchaVerifier.render();
      }

      const fullPhone = "+52" + telefono;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);

      window.confirmationResultGlobal = confirmationResult;
      window.datosUsuarioTemporal = { nombre, apellido, correo, password };

      const modalCodigo = document.getElementById("modalCodigo");
      const modalSMS = document.getElementById("modalSMS");
      modalCodigo.style.display = "flex";
      modalCodigo.classList.add("active");
      modalSMS.classList.add("active");

    } catch (error) {
      console.error("❌ Error durante el proceso de registro:", error);
      errorMsg.textContent = "Ocurrió un error inesperado. Intenta más tarde.";
    }

  } else {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      window.location.reload();
    } catch {
      errorMsg.textContent = "Correo o contraseña incorrectos.";
    }
  }
});

// Verificar código SMS
document.getElementById("btnVerificarCodigo").addEventListener("click", async () => {
  const codigo = document.getElementById("codigoSMS").value.trim();
  const errorSMS = document.getElementById("errorSMS");

  if (!/^\d{6}$/.test(codigo)) {
    errorSMS.textContent = "Código inválido.";
    return;
  }

  if (yaVerificado) {
    errorSMS.textContent = "Ya verificado, por favor recarga.";
    return;
  }

  try {
    const result = await window.confirmationResultGlobal.confirm(codigo);
    const user = result.user;

    const credencial = EmailAuthProvider.credential(
      window.datosUsuarioTemporal.correo,
      window.datosUsuarioTemporal.password
    );

    try {
      await linkWithCredential(user, credencial);
    } catch {
      await user.delete();
      cerrarModalCodigo();
      errorSMS.textContent = "Este correo ya está en uso. Intenta con otro.";
      return;
    }

    yaVerificado = true;

    await updateProfile(user, {
      displayName: `${window.datosUsuarioTemporal.nombre} ${window.datosUsuarioTemporal.apellido}`
    });

    await setDoc(doc(db, "usuarios", user.uid), {
      nombre: window.datosUsuarioTemporal.nombre,
      apellido: window.datosUsuarioTemporal.apellido,
      correo: user.email || "sincorreo@alfomex.com",
      telefono: user.phoneNumber || "No registrado",
      rol: "cliente"
    });

    cerrarModalCodigo();
    localStorage.setItem("bienvenida", `${window.datosUsuarioTemporal.nombre} ${window.datosUsuarioTemporal.apellido}`);
    window.location.reload();

  } catch (e) {
    console.error(e);
    errorSMS.textContent = "Código incorrecto o vencido.";
  }
});

// Input de teléfono solo acepta números
document.getElementById("telefonoRegistro").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

// Función de cierre de modal de código
function cerrarModalCodigo() {
  const modalCodigo = document.getElementById("modalCodigo");
  const modalSMS = document.getElementById("modalSMS");
  modalCodigo.classList.remove("active");
  modalSMS.classList.remove("active");
  modalCodigo.style.display = "none";

  document.getElementById("codigoSMS").value = "";
  document.getElementById("errorSMS").textContent = "";
}
window.cerrarModalCodigo = cerrarModalCodigo;
