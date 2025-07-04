document.getElementById("añadirCarrito").addEventListener("click", () => {
  document.getElementById("loaderOverlay").style.display = "flex";
  setTimeout(enviarPorCorreo, 50);
});

async function enviarPorCorreo() {
  const ancho = ((img.width * scale) / pxPorCm).toFixed(2);
  const alto = ((img.height * scale) / pxPorCm).toFixed(2);

  const canvasTemp = document.createElement("canvas");
  canvasTemp.width = img.width;
  canvasTemp.height = img.height;
  const ctxTemp = canvasTemp.getContext("2d");
  ctxTemp.drawImage(img, 0, 0);

  const imagenBase64 = canvasTemp.toDataURL("image/png").split(",")[1];

  if (!imagenBase64 || imagenBase64.trim() === "") {
    mostrarNotificacion("⚠️ Imagen inválida. Intenta subir otra imagen.", "error");
    return;
  }

  let costo = "Costo no calculado";
  let medidas = "Medidas no disponibles";

  try {
    const res = await fetch("https://backend-1pvf.onrender.com/calcular-costo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagenBase64 })
    });

    const data = await res.json();
    medidas = `${data.ancho} cm x ${data.alto} cm`;
    costo = `Área cubierta: ${data.area} Costo Tela: $${data.tela} Costo Fieltro: $${data.fieltro} Costo Estambre Total: $${data.estambre} Costo aproximado: $${data.total}`;
  } catch (err) {
    mostrarNotificacion("❌ No se pudo calcular el costo", "error");
    document.getElementById("loaderOverlay").style.display = "none";
    return;
  }

  if (!window.auth) {
    mostrarNotificacion("❌ Error: Firebase no está disponible", "error");
    return;
  }

  window.auth.onAuthStateChanged(async function(user) {
    if (!user) {
      document.getElementById("loaderOverlay").style.display = "none";
      localStorage.setItem("forzarLoginPedido", "true");
      window.location.href = "index.html";
      return;
    }

    await user.reload();

    const nombre = user.displayName || user.phoneNumber || "Cliente sin nombre";
    const correo = user.email || "correo@sin-dato.com";
    const telefono = user.phoneNumber || "No registrado";

    try {
      const subir = await fetch("https://backend-1pvf.onrender.com/subir-imagen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagenBase64 })
      });

      const data = await subir.json();
      if (!data.url) throw new Error("No se pudo obtener la URL de la imagen");

      const imagenURL = data.url;

      

      await fetch("https://backend-1pvf.onrender.com/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: nombre,
          email: correo,
          telefono: telefono,
          medidas: medidas,
          costo: costo,
          imagen: imagenURL,
          ancho: parseFloat(ancho),
          alto: parseFloat(alto)
        })
      });

      const token = await auth.currentUser.getIdToken();
      const validar = await fetch("https://backend-1pvf.onrender.com/guardar-pedido-firestore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      if (validar.status === 429) {
        mostrarNotificacion("⚠️ Solo puedes hacer pedidos cada 5 minutos", "error");
        document.getElementById("loaderOverlay").style.display = "none";
        return;
      }

      mostrarNotificacion("✅ Pedido enviado", "success");
      document.getElementById("añadirCarrito").disabled = true;
      iniciarTemporizadorVisual();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);

    } catch (err) {
      console.error("❌ Error al enviar:", err);
      mostrarNotificacion("❌ Error al enviar: " + err.message, "error");
    } finally {
      document.getElementById("loaderOverlay").style.display = "none";
    }
  });
}

function iniciarTemporizadorVisual(restanteMs = 5 * 60 * 1000) {
  const boton = document.getElementById("añadirCarrito");
  const texto = document.getElementById("totalFinal");

  boton.disabled = true;
  const fin = Date.now() + restanteMs;

  const intervalo = setInterval(() => {
    const restante = Math.max(0, fin - Date.now());
    const minutos = Math.floor(restante / 60000);
    const segundos = Math.floor((restante % 60000) / 1000).toString().padStart(2, '0');
    texto.textContent = `Espera ${minutos}:${segundos}`;

    if (restante <= 0) {
      clearInterval(intervalo);
      texto.textContent = "Solicitar pedido";
      boton.disabled = false;
    }
  }, 1000);
}
