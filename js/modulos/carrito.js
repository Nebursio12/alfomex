function renderizarCarrito() {
  const contenedor = document.getElementById("carritoLista");
  const mensajeVacio = document.getElementById("mensajeCarritoVacio");
  const carrito = JSON.parse(localStorage.getItem("carritoAlfombras")) || [];

  const itemsActuales = contenedor.querySelectorAll(".item-carrito");
  itemsActuales.forEach(item => item.remove());

  if (carrito.length === 0) {
    mensajeVacio.style.display = "block";
    contenedor.classList.add("oculto");
    return;
  }

  mensajeVacio.style.display = "none";

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" style="width:50px;height:50px;border-radius:8px;">
      <div style="flex:1">
        <strong>${item.nombre}</strong><br>
        Tamaño: ${item.ancho} x ${item.alto} cm<br>
        Precio: ${item.costo}
      </div>
      <button onclick="eliminarDelCarrito(${item.id})" style="color:red;">✖</button>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarDelCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carritoAlfombras")) || [];
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem("carritoAlfombras", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("contadorCarrito");
  const carrito = JSON.parse(localStorage.getItem("carritoAlfombras")) || [];
  if (carrito.length > 0) {
    contador.innerText = carrito.length;
    contador.style.display = "block";
  } else {
    contador.style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
  actualizarContadorCarrito();

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      const carrito = document.getElementById("carritoLista");
      carrito.classList.toggle("oculto");
    });
  }
});
