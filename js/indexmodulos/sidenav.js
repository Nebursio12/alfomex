// js/sidenav.js
import { auth } from "./firebase/config.js";

window.openNav = () => {
  cerrarModal();
  document.getElementById("mySidenav").classList.add("open");
  document.getElementById("modalOverlay").classList.add("active");
};

window.closeNav = () => {
  document.getElementById("mySidenav").classList.remove("open");
  document.getElementById("modalOverlay").classList.remove("active");
};

window.verificarPedidoPersonalizado = () => {
  if (auth.currentUser) {
    location.href = "alfomex.html";
  } else {
    abrirModal();
  }
};
