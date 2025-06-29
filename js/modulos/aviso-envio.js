window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("con-aviso");
});

function cerrarAviso() {
  const aviso = document.getElementById("avisoEnvio");
  aviso.style.display = "none";
  document.body.classList.remove("con-aviso");
}
