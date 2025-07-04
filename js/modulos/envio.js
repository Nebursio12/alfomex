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
    const token = await user.getIdToken();

    const nombre = user.displayName || user.phoneNumber || "Cliente sin nombre";
    const correo = user.email || "correo@sin-dato.com";
    const telefono = user.phoneNumber || "No registrado";

    try {
      // 🔒 Calcular costo con token
      const res = await fetch("https://backend-1pvf.onrender.com/calcular-costo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ imagenBase64 })
      });
      const data = await res.json();
      const medidas = `${data.ancho} cm x ${data.alto} cm`;
      const costo = `Área cubierta: ${data.area} Costo Tela: $${data.tela} Costo Fieltro: $${data.fieltro} Costo Estambre Total: $${data.estambre} Costo aproximado: $${data.total}`;

      // 🔒 Subir imagen con token
      const subir = await fetch("https://backend-1pvf.onrender.com/subir-imagen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ imagenBase64 })
      });
      const subirData = await subir.json();
      if (!subirData.url) throw new Error("No se pudo obtener la URL de la imagen");

      const imagenURL = subirData.url;

      // 🔒 Enviar pedido con token
      await fetch("https://backend-1pvf.onrender.com/enviar-pedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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

      // 🔒 Guardar pedido en Firestore
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
