// js/modal.js

window.abrirModal = () => {
  closeNav();
  toggleFormulario(false);
  document.getElementById("loginModal").classList.add("active");
  document.getElementById("modalOverlay").classList.add("active");
};

window.cerrarModal = () => {
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
    document.getElementById("recuperacion").style.display = "none";
    document.getElementById("emailRecuperar").value = "";
  }, 300);
};

// Cierre al dar clic fuera del modal
document.getElementById("modalOverlay").addEventListener("click", () => {
  cerrarModal();
  closeNav();
});

// Cierre con tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal();
    closeNav();
  }
});
