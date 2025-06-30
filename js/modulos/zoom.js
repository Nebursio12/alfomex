let zoomInterval;
let ultimaAdvertenciaZoom = 0;

function aplicarZoom(delta) {
  const nuevoScale = scale + delta;
  if (nuevoScale < 0.1) return;

  const nuevaAnchuraCm = (img.width * nuevoScale) / pxPorCm;
  const nuevaAlturaCm = (img.height * nuevoScale) / pxPorCm;

  if (nuevaAnchuraCm > 100 || nuevaAlturaCm > 100) {
    mostrarNotificacion("⚠️ Tamaño máximo alcanzado (100 cm)");
    return;
  }

  if (nuevaAnchuraCm < 25 || nuevaAlturaCm < 25) {
    mostrarNotificacion("⚠️ Tamaño mínimo alcanzado (25 cm)");
    return;
  }

  scale = nuevoScale;
  centrarImagen();
  draw();
  actualizarPresupuestoConRetraso();

  const ancho = (img.width * scale) / pxPorCm;
  const alto = (img.height * scale) / pxPorCm;
  mostrarCambioDimensiones(ancho, alto);

  imgX = Math.min(Math.max(imgX, 0), canvas.width - img.width * scale);
  imgY = Math.min(Math.max(imgY, 0), canvas.height - img.height * scale);
}

function mostrarCambioDimensiones(ancho, alto) {
  const ahora = Date.now();
  if (ahora - ultimaAdvertenciaZoom < 1000) return;
  ultimaAdvertenciaZoom = ahora;

  const toast = document.getElementById("toastNotificacion");
  if (!toast) return;

  toast.classList.remove("toast-dimensiones", "toast-advertencia");
  toast.classList.add("toast-dimensiones");
  toast.innerHTML = `Anchura: ${ancho.toFixed(2)} cm<br>Altura: ${alto.toFixed(2)} cm`;
  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 3000);
}

function mostrarNotificacion(mensaje, tipo = "error") {
  const toast = document.getElementById("toastNotificacion");
  if (!toast) return;
  toast.classList.remove("toast-dimensiones", "toast-advertencia");

  if (tipo === "success") {
    toast.style.background = "#81C784";
  } else {
    toast.classList.add("toast-advertencia");
  }

  toast.innerText = mensaje;
  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 3000);
}

function iniciarZoom(delta) {
  aplicarZoom(delta);
  zoomInterval = setInterval(() => aplicarZoom(delta), 100);
}

function detenerZoom() {
  clearInterval(zoomInterval);
}

function iniciarZoomSeguro(delta) {
  detenerZoom();
  aplicarZoom(delta);
  zoomInterval = setInterval(() => aplicarZoom(delta), 100);
}

window.addEventListener("DOMContentLoaded", () => {
  const zoomMas = document.getElementById("zoomMas");
  const zoomMenos = document.getElementById("zoomMenos");

  zoomMas.addEventListener("mousedown", () => iniciarZoomSeguro(0.01));
  zoomMenos.addEventListener("mousedown", () => iniciarZoomSeguro(-0.01));
  zoomMas.addEventListener("touchstart", () => iniciarZoomSeguro(0.01));
  zoomMenos.addEventListener("touchstart", () => iniciarZoomSeguro(-0.01));

  ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(evt => {
    zoomMas.addEventListener(evt, detenerZoom);
    zoomMenos.addEventListener(evt, detenerZoom);
  });
});
