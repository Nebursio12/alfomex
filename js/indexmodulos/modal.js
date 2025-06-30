// js/modal.js

function abrirModal() {
  window.closeNav(); // 👈 aquí
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

window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

document.getElementById("modalOverlay").addEventListener("click", () => {
  cerrarModal();
  window.closeNav(); // 👈 también aquí
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal();
    window.closeNav(); // 👈 y aquí
  }
});
