const imgInput = document.getElementById("imgInput");

imgInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
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
    imagenOriginal.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
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
      });
    };
    imagenOriginal.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});
