function abrirModal() {
  if (document.readyState !== "complete") {
    window.addEventListener("DOMContentLoaded", abrirModal, { once: true });
    return;
  }

  try {
    if (typeof window.closeNav === "function") window.closeNav();
    if (typeof window.toggleFormulario === "function") window.toggleFormulario(false);

    const modal = document.getElementById("loginModal");
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) {
      console.error("❌ Elementos del modal no encontrados");
      return;
    }

    modal.classList.add("active");
    overlay.classList.add("active");
  } catch (error) {
    console.error("Error en abrirModal:", error);
  }
}


function cerrarModal() {
  try {
    const modal = document.getElementById("loginModal");
    const overlay = document.getElementById("modalOverlay");

    if (modal) modal.classList.remove("active");
    if (overlay) overlay.classList.remove("active");

    const recuperacion = document.getElementById("recuperacion");
    if (recuperacion) recuperacion.style.display = "none";
    
    const emailRecuperar = document.getElementById("emailRecuperar");
    if (emailRecuperar) emailRecuperar.value = "";

    setTimeout(() => {
      const errorMsg = document.getElementById("errorMsg");
      if (errorMsg) {
        errorMsg.textContent = "";
        errorMsg.classList.remove("error-anim", "red", "green");
      }

      const email = document.getElementById("email");
      const password = document.getElementById("password");
      if (email) email.value = "";
      if (password) password.value = "";
    }, 300);
  } catch (error) {
    console.error("Error en cerrarModal:", error);
  }
}

// ✅ SIEMPRE expón al window, aunque esté dentro de type="module"
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

// ✅ Esperar a que el DOM esté listo antes de añadir eventos
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      cerrarModal();
      if (typeof window.closeNav === "function") window.closeNav();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarModal();
      if (typeof window.closeNav === "function") window.closeNav();
    }
  });
});
