import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from "/js/indexmodulos/config.js";

// Categorías que coinciden con los IDs del HTML
const categorias = [
  { firestore: "originales", htmlId: "originaless" },
  { firestore: "personajes", htmlId: "personajess" },
  { firestore: "marcas", htmlId: "marcass" },
  { firestore: "futbos", htmlId: "futboss" } // Ajusta esto en Firestore si es necesario
];

async function mostrarMenu() {
  for (const cat of categorias) {
    const q = query(
      collection(db, "menu"),
      where("categoria", "==", cat.firestore)
    );
    const snapshot = await getDocs(q);

    const contenedor = document.getElementById(cat.htmlId);
    if (!contenedor) continue;

    snapshot.forEach(doc => {
      const data = doc.data();
      const tarjeta = document.createElement("div");
      tarjeta.className = "alfombra";

      tarjeta.innerHTML = `
        <img src="${data.imagen}" alt="${data.nombre}" width="200" height="200" loading="lazy" />
        <h4>${data.nombre}</h4>
        <p>$${data.precio}</p>
        <div class="botones-producto">
          <button class="btn-añadir">🛒 Añadir</button>
          <button class="btn-ver-mas">🔍 Ver más</button>
        </div>
      `;

      // Añadir al carrito
      tarjeta.querySelector(".btn-añadir").addEventListener("click", () => {
        const producto = {
          id: doc.id,
          nombre: data.nombre,
          precio: data.precio,
          imagen: data.imagen
        };
        añadirAlCarrito(producto); // Asegúrate de que esta función esté definida en carritoindex.js
      });

      // Ver detalles
      tarjeta.querySelector(".btn-ver-mas").addEventListener("click", () => {
        window.location.href = `producto.html?id=${doc.id}`;
      });

      contenedor.appendChild(tarjeta);
    });
  }
}

// Iniciar
mostrarMenu();