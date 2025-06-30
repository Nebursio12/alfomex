// js/carrito.js
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { auth, db } from "/alfomex/js/indexmodulos/config.js";

// Añadir producto al carrito
window.añadirAlCarrito = (producto) => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderizarCarrito();
  mostrarToastCarrito(`🛒 ${producto.nombre} añadido al carrito`);
  actualizarContadorCarrito();
};

// Mostrar contenido del carrito
function renderizarCarrito() {
  const contenedor = document.getElementById("carritoLista");
  const mensajeVacio = document.getElementById("mensajeCarritoVacio");
  const resumen = document.getElementById("resumenCarrito");
  const totalTexto = document.getElementById("totalCarrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  contenedor.querySelectorAll(".item-carrito").forEach(item => item.remove());

  if (carrito.length === 0) {
    mensajeVacio.style.display = "block";
    resumen.style.display = "none";
    contenedor.classList.add("oculto");
    return;
  }

  mensajeVacio.style.display = "none";
  resumen.style.display = "block";
  contenedor.classList.remove("oculto");

  let total = 0;

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" style="width:50px;height:50px;border-radius:8px;">
      <div style="flex:1">
        <strong>${item.nombre}</strong><br>
        Precio: $${item.precio}
      </div>
      <button onclick="eliminarDelCarrito(${index})" style="color:red;">&times;</button>
    `;
    contenedor.insertBefore(div, resumen);
    total += Number(item.precio);
  });

  totalTexto.innerText = total.toFixed(2);
}

// Eliminar un producto del carrito
window.eliminarDelCarrito = (index) => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarContadorCarrito();
};

// Mostrar u ocultar el carrito (modal o panel)
window.abrirCarrito = () => {
  const carrito = document.getElementById("carritoLista");
  carrito.classList.toggle("oculto");
};

// Actualizar contador del carrito en el ícono
function actualizarContadorCarrito() {
  const contador = document.getElementById("contadorCarrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  contador.textContent = carrito.length;
  contador.style.display = carrito.length ? "block" : "none";
}

// Comprar ahora (guarda en Firestore)
window.comprarAhora = async () => {
  const user = auth.currentUser;

  if (!user) {
    abrirModal();
    mostrarToastCarrito("🔒 Debes iniciar sesión para comprar");
    return;
  }

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length === 0) {
    mostrarToastCarrito("🛒 Tu carrito está vacío");
    return;
  }

  const pedido = {
    uid: user.uid,
    correo: user.email || "Sin correo",
    productos: carrito,
    total: carrito.reduce((sum, item) => sum + Number(item.precio), 0),
    fecha: new Date().toISOString(),
    estado: "pendiente"
  };

  try {
    await addDoc(collection(db, "pedidosUsuarios"), pedido);
    mostrarToastCarrito("✅ Pedido enviado correctamente");
    localStorage.removeItem("carrito");
    renderizarCarrito();
    actualizarContadorCarrito();
  } catch (error) {
    console.error("❌ Error al guardar pedido:", error);
    mostrarToastCarrito("❌ Error al guardar el pedido");
  }
};

// Toast de confirmación
function mostrarToastCarrito(mensaje) {
  const toast = document.getElementById("toastCarrito");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
  actualizarContadorCarrito();

  if (localStorage.getItem("forzarLoginPedido") === "true") {
    localStorage.removeItem("forzarLoginPedido");
    abrirModal();
    const toast = document.getElementById("toastCarrito");
    toast.textContent = "🔒 Para hacer un pedido personalizado, necesitas tener una cuenta.";
    toast.classList.add("show", "toast-alerta");
    setTimeout(() => {
      toast.classList.remove("show", "toast-alerta");
    }, 3000);
  }
});
