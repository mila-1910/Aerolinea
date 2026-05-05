document.addEventListener("DOMContentLoaded", () => {
    const vueloGuardado = localStorage.getItem("vueloSeleccionado");

    const imagen = document.getElementById("detalle-imagen-vuelo");
    const ciudad = document.getElementById("detalle-ciudad");
    const precio = document.getElementById("detalle-precio");
    const tipo = document.getElementById("detalle-tipo");
    const numero = document.getElementById("detalle-numero");
    const ruta = document.getElementById("detalle-ruta");
    const duracion = document.getElementById("detalle-duracion");
    const escala = document.getElementById("detalle-escala");
    const origenSelect = document.getElementById("detalle-origen-select");
    const fechaSelect = document.getElementById("detalle-fecha-select");
    const btnReservar = document.getElementById("btn-reservar-vuelo");

    const descripcionToggle = document.getElementById("descripcion-toggle");
    const descripcionTexto = document.getElementById("descripcion-texto");
    const descripcionIcono = document.getElementById("descripcion-icono");

    if (!vueloGuardado) return;

    const vuelo = JSON.parse(vueloGuardado);

    // Carga los datos del vuelo seleccionado
    imagen.src = vuelo.imagen;
    imagen.alt = vuelo.ciudad;
    ciudad.textContent = vuelo.ciudad;
    precio.textContent = vuelo.precio;
    tipo.textContent = "Vuelo ida y vuelta";
    numero.textContent = vuelo.numeroVuelo;
    ruta.textContent = vuelo.ruta;
    duracion.textContent = vuelo.duracion;
    escala.textContent = vuelo.escala;

    origenSelect.innerHTML = `<option>${vuelo.origen}</option>`;
    fechaSelect.innerHTML = `<option>${vuelo.fechaTexto}</option>`;

    // Abre y cierra la descripción
    descripcionToggle.addEventListener("click", () => {
        descripcionTexto.classList.toggle("oculta");

        descripcionIcono.textContent = descripcionTexto.classList.contains("oculta")
            ? "▼"
            : "▲";
    });

    btnReservar.addEventListener("click", () => {
        // Guarda la reserva para el resumen
        const reservaEnProceso = {
            numeroReserva: "RES-" + Date.now().toString().slice(-4),
            estado: "Pendiente",
            pasajeros: 1,
            total: vuelo.precio,
            vuelo: vuelo
        };

        localStorage.setItem("reservaEnProceso", JSON.stringify(reservaEnProceso));
    });
});
