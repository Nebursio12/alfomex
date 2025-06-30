const overlayDrag = document.getElementById("overlayDrag");
const mensajeDrag = document.getElementById("mensajeDrag");

document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

document.addEventListener("dragenter", (e) => {
  const dt = e.dataTransfer || e.originalEvent?.dataTransfer;
  if (dt?.items?.length > 0) {
    const tipo = dt.items[0].type;
    mensajeDrag.textContent = tipo.startsWith("image/")
      ? "¡Suelta tu imagen aquí!"
      : "⚠️ Solo se permiten imágenes PNG o JPG";
  }
  overlayDrag.classList.add("active");
});

document.addEventListener("dragleave", (e) => {
  if (e.relatedTarget === null || e.target === document) {
    overlayDrag.classList.remove("active");
    mensajeDrag.textContent = "¡Suelta tu imagen aquí!";
  }
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  overlayDrag.classList.remove("active");
  mensajeDrag.textContent = "¡Suelta tu imagen aquí!";

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const imagenOriginal = new Image();
      imagenOriginal.onload = function () {
        if (typeof recortarTransparencias === "function" && typeof cargarImagenAlLienzo === "function") {
          recortarTransparencias(imagenOriginal, function(imagenRecortada) {
            cargarImagenAlLienzo(imagenRecortada.src);
          });
        }
      };
      imagenOriginal.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});
