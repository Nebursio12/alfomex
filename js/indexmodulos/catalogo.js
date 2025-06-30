// js/catalogo.js
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { db } from "/js/indexmodulos/config.js";
// Función para mostrar las alfombras por categoría
async function mostrarMenu() {
  const categorias = ["originales", "personajes", "marcas", "futbos"];

  for (const cat of categorias) {
    const snapshot = await getDocs(
      query(collection(db, "menu"), where("categoria", "==", cat))
    );

    snapshot.forEach(doc => {
      const data = doc.data();
      const contenedor = document.getElementById(`${cat}s`);
      const tarjeta = document.createElement("div");
      tarjeta.className = "alfombra";
      tarjeta.innerHTML = `
        <img src="${data.imagen}" alt="${data.nombre}" />
        <h4>${data.nombre}</h4>
        <p>$${data.precio}</p>
        <button class="btn-añadir" onclick='añadirAlCarrito(${JSON.stringify({
          nombre: data.nombre,
          precio: data.precio,
          imagen: data.imagen
        })})'>🛒</button>
      `;

      contenedor.appendChild(tarjeta);
    });
  }
}

mostrarMenu();

// Función para desplazarse a la categoría
window.scrollToCategoria = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
