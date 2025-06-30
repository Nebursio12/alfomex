// js/modal.js
function abrirModal() {
  closeNav();
  toggleFormulario(false);
  document.getElementById("loginModal").classList.add("active");
  document.getElementById("modalOverlay").classList.add("active");
}

function cerrarModal() {
  const modal = document.getElementById("loginModal");
  const overlay = document.getElementById("modalOverlay");

  modal.classList.remove("active");
  overlay.classList.remove("active");

  document.getElementById("recuperacion").style.display = "none";
  document.getElementById("emailRecuperar").value = "";

  setTimeout(() => {
    document.getElementById("errorMsg").textContent = "";
    document.getElementById("errorMsg").classList.remove("error-anim", "red", "green");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }, 300);
}

// 👉 Exponer funciones al contexto global:
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

// Cierre automático
document.getElementById("modalOverlay").addEventListener("click", () => {
  cerrarModal();
  closeNav();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal();
    closeNav();
  }
});
