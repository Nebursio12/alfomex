import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { db } from "/js/indexmodulos/config.js";

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

      const producto = {
        nombre: data.nombre,
        precio: data.precio,
        imagen: data.imagen
      };

      tarjeta.innerHTML = `
        <img src="${data.imagen}" alt="${data.nombre}" width="200" height="200" loading="lazy" />
        <h4>${data.nombre}</h4>
        <p>$${data.precio}</p>
        <div class="botones-producto">
          <button class="btn-añadir">🛒 Añadir</button>
          <button class="btn-ver-mas">🔍 Ver más</button>
        </div>
      `;

      // Botón para añadir al carrito
      const btnAñadir = tarjeta.querySelector(".btn-añadir");
      btnAñadir.addEventListener("click", () => añadirAlCarrito(producto));

      // Botón para ir a la página del producto
      const btnVerMas = tarjeta.querySelector(".btn-ver-mas");
      btnVerMas.addEventListener("click", () => {
        location.href = `producto.html?id=${doc.id}`;
      });

      contenedor.appendChild(tarjeta);
    });
  }
}

mostrarMenu();

window.scrollToCategoria = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
