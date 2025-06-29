const overlayDrag = document.getElementById("overlayDrag");
const mensajeDrag = document.getElementById("mensajeDrag");

document.addEventListener("dragenter", (e) => {
  const dt = e.dataTransfer || e.originalEvent?.dataTransfer;
  if (dt?.items?.length > 0) {
    const tipo = dt.items[0].type;
    mensajeDrag.textContent = tipo.startsWith("image/") ?
      "¡Suelta tu imagen aquí!" : "⚠️ Solo se permiten imágenes PNG o JPG";
  }
  overlayDrag.classList.add("active");
});

document.addEventListener("dragleave", (e) => {
  if (e.relatedTarget === null || e.target === document) {
    overlayDrag.classList.remove("active");
    mensajeDrag.textContent = "¡Suelta tu imagen aquí!";
  }
});

document.addEventListener("drop", () => {
  overlayDrag.classList.remove("active");
  mensajeDrag.textContent = "¡Suelta tu imagen aquí!";
});
