const imgInput = document.getElementById("imgInput");

imgInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    cargarImagenAlLienzo(evt.target.result);
  };
  reader.readAsDataURL(file);
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    cargarImagenAlLienzo(evt.target.result);
  };
  reader.readAsDataURL(file);
});

function recortarTransparencias(imagen, callback) {
  const canvasTmp = document.createElement('canvas');
  canvasTmp.width = imagen.width;
  canvasTmp.height = imagen.height;
  const ctxTmp = canvasTmp.getContext('2d');
  ctxTmp.drawImage(imagen, 0, 0);

  const imgData = ctxTmp.getImageData(0, 0, canvasTmp.width, canvasTmp.height).data;
  let top = canvasTmp.height, left = canvasTmp.width, right = 0, bottom = 0;

  for (let y = 0; y < canvasTmp.height; y++) {
    for (let x = 0; x < canvasTmp.width; x++) {
      const i = (y * canvasTmp.width + x) * 4;
      const alpha = imgData[i + 3];
      if (alpha > 10) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  const ancho = right - left + 1;
  const alto = bottom - top + 1;

  const canvasRecorte = document.createElement('canvas');
  canvasRecorte.width = ancho;
  canvasRecorte.height = alto;
  const ctxRecorte = canvasRecorte.getContext('2d');
  ctxRecorte.drawImage(imagen, left, top, ancho, alto, 0, 0, ancho, alto);

  const imgRecortada = new Image();
  imgRecortada.onload = () => callback(imgRecortada);
  imgRecortada.src = canvasRecorte.toDataURL();
}

function cargarImagenAlLienzo(src) {
  const imagenOriginal = new Image();
  imagenOriginal.onload = function () {
    recortarTransparencias(imagenOriginal, function(imagenRecortada) {
      img = imagenRecortada;

      const factorX = canvas.width / img.width;
      const factorY = canvas.height / img.height;
      scale = Math.min(factorX, factorY, 1);
      imgX = (canvas.width - img.width * scale) / 2;
      imgY = (canvas.height - img.height * scale) / 2;

      draw();
      mostrarPresupuestoVisual();

      document.querySelector('.lateral').style.display = 'flex';
      document.getElementById("resultado").style.display = "block";
      document.getElementById("añadirCarrito").style.display = "flex";

      const recorteSrc = imagenRecortada.src;
      const vista = document.getElementById("vistaAlfombra");
      vista.src = recorteSrc;
      vista.style.display = "block";
      vista.setAttribute("data-src-real", recorteSrc);
      document.getElementById("modalImagenAlfombra").src = recorteSrc;

      const previewImg = document.querySelector(".btn-preview-cuarto img");
      if (previewImg && window.innerWidth >= 1000) {
        previewImg.src = recorteSrc;
      }

      if (window.innerWidth < 1000) {
        const contenedor = document.querySelector(".zoom-container");
        const pxPorCmCuarto = contenedor.offsetWidth / 300;
        const anchoCm = (img.width * scale) / pxPorCm;
        const altoCm = (img.height * scale) / pxPorCm;
        vista.style.width = `${anchoCm * pxPorCmCuarto}px`;
        vista.style.height = `${altoCm * pxPorCmCuarto}px`;
        vista.style.position = "absolute";
        vista.style.top = "78%";
        vista.style.left = "25%";
        vista.style.transform = "translate(-50%, -50%)";
      }
    });
  };
  imagenOriginal.src = src;
}


window.cargarImagenAlLienzo = cargarImagenAlLienzo;
window.recortarTransparencias = recortarTransparencias;
