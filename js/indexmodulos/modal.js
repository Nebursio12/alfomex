// js/modal.js

function abrirModal() {
  if (typeof window.closeNav === "function") window.closeNav();
  if (typeof window.toggleFormulario === "function") window.toggleFormulario(false);
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

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    if (email) email.value = "";
    if (password) password.value = "";
  }, 300);
}

window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

document.getElementById("modalOverlay").addEventListener("click", () => {
  cerrarModal();
  if (typeof window.closeNav === "function") window.closeNav();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal();
    if (typeof window.closeNav === "function") window.closeNav();
  }
});
