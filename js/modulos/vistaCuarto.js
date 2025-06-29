let vistaModalAbierto = false;

function toggleVistaCuarto() {
  const modal = document.getElementById("modalVistaCuarto");
  const imgAlfombra = document.getElementById("modalImagenAlfombra");
  const vistaAlfombra = document.getElementById("vistaAlfombra");

  if (!modal || !imgAlfombra || !vistaAlfombra.src || vistaModalAbierto) return;

  vistaModalAbierto = true;
  imgAlfombra.src = vistaAlfombra.src;

  const anchoCm = (img.width * scale) / pxPorCm;
  const altoCm = (img.height * scale) / pxPorCm;
  const pxPorCmCuarto = 496 / 300;

  imgAlfombra.style.width = `${anchoCm * pxPorCmCuarto}px`;
  imgAlfombra.style.height = `${altoCm * pxPorCmCuarto}px`;
  imgAlfombra.style.position = "absolute";
  imgAlfombra.style.top = "78%";
  imgAlfombra.style.left = "25%";
  imgAlfombra.style.transform = "translate(-50%, -50%)";

  modal.classList.add("activo", "animarEntrada");
  modal.classList.remove("animarSalida");
}

function cerrarVistaCuarto() {
  const modal = document.getElementById("modalVistaCuarto");
  if (!modal || !vistaModalAbierto) return;

  vistaModalAbierto = false;
  modal.classList.remove("animarEntrada");
  modal.classList.add("animarSalida");

  setTimeout(() => {
    modal.classList.remove("activo", "animarSalida");
  }, 200);
}

window.addEventListener("DOMContentLoaded", () => {
  const btnPreview = document.querySelector(".btn-preview-cuarto");
  const modal = document.getElementById("modalVistaCuarto");

  if (btnPreview && modal && window.innerWidth >= 1000) {
    btnPreview.addEventListener("mouseenter", () => {
      if (!vistaModalAbierto) toggleVistaCuarto();
    });

    modal.addEventListener("mouseleave", () => {
      if (vistaModalAbierto) cerrarVistaCuarto();
    });
  }
});
