import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const auth = window.auth || getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const verif = await fetch("https://backend-1pvf.onrender.com/verificar-ultimo-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const verifData = await verif.json();
      if (verifData.ultimo) {
        const ahora = Date.now();
        const restante = verifData.ultimo + 5 * 60 * 1000 - ahora;
        if (restante > 0) {
          iniciarTemporizadorVisual(restante);
        }
      }
    } catch (err) {
      console.error("❌ Error al verificar último pedido:", err);
    }
  });
});
