

const imgs = document.querySelectorAll(".banner-img");
const puntosContainer = document.getElementById("puntosBanner");
let currentIndex = 0;
let interval;


imgs.forEach((_, i) => {
  const punto = document.createElement("span");
  punto.addEventListener("click", () => {
    mostrarImagen(i);
    reiniciarIntervalo();
  });
  puntosContainer.appendChild(punto);
});

const puntos = puntosContainer.querySelectorAll("span");


function mostrarImagen(index) {
  imgs.forEach(img => img.classList.remove("active"));
  puntos.forEach(p => p.classList.remove("active"));
  imgs[index].classList.add("active");
  puntos[index].classList.add("active");
  currentIndex = index;
}


function siguienteImagen() {
  currentIndex = (currentIndex + 1) % imgs.length;
  mostrarImagen(currentIndex);
}

function reiniciarIntervalo() {
  clearInterval(interval);
  interval = setInterval(siguienteImagen, 5000);
}


mostrarImagen(0);
interval = setInterval(siguienteImagen, 5000);
