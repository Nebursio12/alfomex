async function mostrarPresupuestoVisual() {
  const canvasTemp = document.createElement("canvas");
  canvasTemp.width = img.width * scale;
  canvasTemp.height = img.height * scale;
  const ctxTemp = canvasTemp.getContext("2d");
  ctxTemp.drawImage(img, 0, 0, canvasTemp.width, canvasTemp.height);
  const imagenBase64 = canvasTemp.toDataURL("image/png").split(",")[1];

  try {
    const res = await fetch("https://backend-1pvf.onrender.com/calcular-costo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagenBase64 })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";
    [
      ["Área cubierta:", data.area],
      ["Costo Tela:", `$${data.tela} MXN`],
      ["Costo Fieltro:", `$${data.fieltro} MXN`],
      ["Costo Estambre Total:", `$${data.estambre} MXN`],
      ["Costo aproximado:", `$${data.total} MXN`]
    ].forEach(([titulo, valor]) => {
      const p = document.createElement("p");
      p.textContent = `${titulo} ${valor}`;
      resultado.appendChild(p);
    });

    const panelEstambre = document.getElementById("panelEstambre");
    if (img && img.src) {
      panelEstambre.style.display = "flex";
      panelEstambre.style.visibility = "visible";
      panelEstambre.style.opacity = "1";
      panelEstambre.style.animation = 'fadeSlideIn 0.4s ease forwards';
    }
  } catch (err) {
    console.error("❌ Error al calcular presupuesto:", err);
    const resultado = document.getElementById("resultado");
    resultado.textContent = "⚠️ No se pudo calcular el presupuesto";
    resultado.style.color = "red";
  }
}

let debouncePresupuesto;
function actualizarPresupuestoConRetraso() {
  clearTimeout(debouncePresupuesto);
  debouncePresupuesto = setTimeout(() => {
    mostrarPresupuestoVisual();
  }, 200);
}
