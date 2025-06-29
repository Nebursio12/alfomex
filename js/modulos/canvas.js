const canvas = document.getElementById("lienzo");
canvas.width = canvas.clientWidth || 500;
canvas.height = canvas.clientWidth || 500;
const ctx = canvas.getContext("2d");

let img = new Image();
let fondoCuarto = new Image();
let imgX = 0, imgY = 0;
let scale = 1;
let pxPorCm = canvas.width / 100;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!img || !img.src) {
    document.getElementById("botonCentralImagen").style.display = "block";
    const zoom = document.getElementById("zoomControles");
    if (zoom) zoom.style.display = "none";
    ctx.fillStyle = '#666';
    ctx.font = '18px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText("Arrastra una imagen o da clic en el botón para añadirla", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Puedes usar archivos en formato PNG o JPG de buena calidad", canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText("Tu diseño será analizado automáticamente al cargar.", canvas.width / 2, canvas.height / 2 + 40);
    document.getElementById("areaCubierta").innerHTML = "";
    return;
  }

  document.getElementById("botonCentralImagen").style.display = "none";
  const zoom = document.getElementById("zoomControles");
  if (zoom) zoom.style.display = "flex";

  for (let i = 0; i <= 100; i++) {
    const px = i * pxPorCm;
    ctx.fillStyle = i % 10 === 0 ? '#ddd' : '#eee';
    ctx.fillRect(px, 0, 1, canvas.height);
    ctx.fillRect(0, px, canvas.width, 1);
  }

  ctx.strokeStyle = '#999';
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  for (let i = 0; i <= 100; i += 10) {
    const px = i * pxPorCm;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, px); ctx.lineTo(canvas.width, px); ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.fillText(`${i}cm`, i !== 0 ? px + 4 : 4, i !== 0 ? 4 : 4);
  }

  ctx.drawImage(img, imgX, imgY, img.width * scale, img.height * scale);
}

function centrarImagen() {
  if (!img.src) return;
  imgX = (canvas.width - img.width * scale) / 2;
  imgY = (canvas.height - img.height * scale) / 2;
  draw();
}

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

window.addEventListener("DOMContentLoaded", () => {
  if (typeof draw === "function") draw();
});
