// js/toasts.js

// Mostrar mensaje de bienvenida si hay nombre guardado
window.addEventListener("DOMContentLoaded", () => {
  const nombreGuardado = localStorage.getItem("bienvenida");
  if (nombreGuardado) {
    mostrarBienvenida(nombreGuardado);
    localStorage.removeItem("bienvenida");
  }
});

// Mostrar toast flotante de carrito (llamado desde carrito.js)
window.mostrarToastCarrito = (mensaje) => {
  const toast = document.getElementById("toastCarrito");
  if (!toast) return;

  toast.textContent = mensaje;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
};

// Mostrar toast flotante de bienvenida
function mostrarBienvenida(nombreCompleto) {
  const toast = document.getElementById("toastBienvenida");
  toast.textContent = `Bienvenido ${nombreCompleto}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
