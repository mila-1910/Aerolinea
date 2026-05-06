document.addEventListener("DOMContentLoaded", () => {
    const reservaGuardada = localStorage.getItem("reservaEnProceso");
    const resumenContenedor = document.getElementById("resumen-contenedor");
    const reservaVacia = document.getElementById("reserva-vacia");

    if (!reservaGuardada) {
        // Mensaje si no hay reserva activa
        resumenContenedor.style.display = "none";
        reservaVacia.style.display = "block";
        return;
    }

    const reserva = JSON.parse(reservaGuardada);
    const vuelo = reserva.vuelo;

    const formatoCOP = (valor) => {
        return "$" + Number(valor).toLocaleString("es-CO") + " COP";
    };

    const precioTarifa = () => {
        if (reserva.clase === "Ejecutiva") return 890000;
        if (reserva.clase === "Primera clase") return 1300000;
        return 0;
    };

    const mostrarAviso = (mensaje) => {
        // Aviso de confirmación
        const aviso = document.createElement("div");
        aviso.className = "aviso-resumen";
        aviso.textContent = mensaje;

        document.body.appendChild(aviso);

        setTimeout(() => {
            aviso.classList.add("activo");
        }, 50);
    };

    const obtenerUsuario = () => {
        // Datos temporales del pasajero
        const usuarioGuardado = localStorage.getItem("usuarioActivo");

        if (usuarioGuardado) {
            return JSON.parse(usuarioGuardado);
        }

        return {
            nombre: "María González",
            documento: "123456789",
            nacionalidad: "Colombiana",
            nacimiento: "15/05/1990"
        };
    };

    const guardarReserva = (estado, mensaje) => {
        // Evita guardar la misma reserva dos veces
        const btnConfirmar = document.getElementById("btn-confirmar-reserva");
        const btnGuardar = document.getElementById("btn-guardar-reserva");

        btnConfirmar.classList.add("deshabilitado");
        btnGuardar.classList.add("deshabilitado");

        const reservas = JSON.parse(localStorage.getItem("reservasCliente")) || [];
        const existeReserva = reservas.some(item => item.numeroReserva === reserva.numeroReserva);

        if (!existeReserva) {
            const base = reserva.totalNumero;
            const tarifa = precioTarifa();
            const descuento = Math.round(base * 0.2);
            const total = base + tarifa - descuento;

            reserva.estado = estado;
            reserva.totalNumero = total;
            reserva.totalTexto = formatoCOP(total);
            reserva.pasajero = obtenerUsuario();

            reservas.push(reserva);

            localStorage.setItem("reservasCliente", JSON.stringify(reservas));
        }

        localStorage.removeItem("reservaEnProceso");
        mostrarAviso(mensaje);

        setTimeout(() => {
            window.location.href = "mis-reservas.html";
        }, 900);
    };

    // Número de reserva
    document.getElementById("reserva-numero-badge").textContent = "Reserva #" + reserva.numeroReserva;

    // Datos del pasajero
    const pasajero = obtenerUsuario();

    document.getElementById("pasajero-nombre").textContent = pasajero.nombre;
    document.getElementById("pasajero-documento").textContent = pasajero.documento;
    document.getElementById("pasajero-nacionalidad").textContent = pasajero.nacionalidad;
    document.getElementById("pasajero-nacimiento").textContent = pasajero.nacimiento;

    // Datos del vuelo
    document.getElementById("resumen-origen").textContent = vuelo.origen;
    document.getElementById("resumen-destino").textContent = vuelo.destino;
    document.getElementById("resumen-duracion").textContent = vuelo.duracion;
    document.getElementById("resumen-vuelo").textContent = vuelo.numeroVuelo;
    document.getElementById("resumen-fecha").textContent = vuelo.fechaTexto;
    document.getElementById("resumen-escala").textContent = vuelo.escala;

    document.getElementById("resumen-hora-salida").textContent = "10:30";
    document.getElementById("resumen-llegada").textContent = "8:45 am (+1 día)";

    // Cálculo del pago
    const base = reserva.totalNumero;
    const tarifa = precioTarifa();
    const descuento = Math.round(base * 0.2);
    const total = base + tarifa - descuento;

    document.getElementById("resumen-clase").textContent = reserva.clase.toUpperCase();
    document.getElementById("resumen-tarifa-precio").textContent = formatoCOP(tarifa);
    document.getElementById("pago-vuelo").textContent = formatoCOP(base);
    document.getElementById("pago-tarifa-label").textContent = "Tarifa " + reserva.clase.toLowerCase();
    document.getElementById("pago-tarifa").textContent = formatoCOP(tarifa);
    document.getElementById("pago-descuento").textContent = "-" + formatoCOP(descuento);
    document.getElementById("pago-total").textContent = formatoCOP(total);

    document.getElementById("btn-confirmar-reserva").addEventListener("click", (event) => {
        event.preventDefault();
        guardarReserva("Confirmada", "Reserva confirmada. Te llevamos a Mis reservas...");
    });

    document.getElementById("btn-guardar-reserva").addEventListener("click", (event) => {
        event.preventDefault();
        guardarReserva("Pendiente", "Reserva guardada para después...");
    });
});
