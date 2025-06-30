
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navOptions");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      nav.innerHTML = `
        <button onclick="location.href='perfil.html'" title="Perfil" class="icon-btn btn-perfil">
          <i class="fas fa-user-circle"></i>
        </button>
        <button onclick="cerrarSesion()" title="Cerrar sesión" class="icon-btn btn-logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      `;

      try {
        const token = await user.getIdToken();

        const res = await fetch("https://backend-1pvf.onrender.com/verificar-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        console.log("✅ Datos seguros del usuario:", data);

        const verif = await fetch("https://backend-1pvf.onrender.com/verificar-ultimo-pedido", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const verifData = await verif.json();

        if (verifData.ultimo) {
          const ahora = Date.now();
          const restante = verifData.ultimo + 5 * 60 * 1000 - ahora;
          if (restante > 0 && typeof iniciarTemporizadorVisual === "function") {
            iniciarTemporizadorVisual(restante);
          }
        }
      } catch (err) {
        console.error("❌ Error al verificar usuario o último pedido:", err);
      }
    } else {
      nav.innerHTML = `
        <button onclick="location.href='index.html'" title="Inicio" class="icon-btn btn-perfil">
          <i class="fas fa-home"></i>
        </button>
      `;
    }
  });

  window.cerrarSesion = async () => {
    await signOut(auth);
    window.location.href = "index.html";
  };
});
