document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api";

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
        // Usuario actual del navegador
        const usuarioRaw = localStorage.getItem("usuario");

        if (!usuarioRaw) return null;

        return JSON.parse(usuarioRaw);
    };

    const obtenerDatosPasajero = () => {
        // Datos temporales del pasajero
        const usuario = obtenerUsuario();

        if (usuario) {
            return {
                nombre: usuario.nombre_completo,
                documento: "Pendiente",
                nacionalidad: "Colombiana",
                nacimiento: "Pendiente"
            };
        }

        return {
            nombre: "María González",
            documento: "123456789",
            nacionalidad: "Colombiana",
            nacimiento: "15/05/1990"
        };
    };

    const guardarReservaLocal = (estado, total, tarifa, descuento) => {
        // Respaldo local para seguir usando Mis reservas si la API falla
        const reservas = JSON.parse(localStorage.getItem("reservasCliente")) || [];

        const reservaLocal = {
            ...reserva,
            estado: estado,
            totalNumero: total,
            totalTexto: formatoCOP(total),
            tarifaExtra: tarifa,
            descuento: descuento,
            pasajero: obtenerDatosPasajero()
        };

        const existe = reservas.some(item => item.numeroReserva === reservaLocal.numeroReserva);

        if (!existe) {
            reservas.push(reservaLocal);
            localStorage.setItem("reservasCliente", JSON.stringify(reservas));
        }

        return reservaLocal;
    };

    const guardarReservaEnBaseDatos = async (estado, total, tarifa, descuento) => {
        const usuario = obtenerUsuario();

        if (!usuario) {
            throw new Error("No hay usuario activo");
        }

        // Envia la reserva a Neon por medio del backend
        const response = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                numero_reserva: reserva.numeroReserva,
                id_usuario: usuario.id,
                id_vuelo: reserva.idVuelo,
                estado: estado,
                clase: reserva.clase,
                pasajeros: reserva.pasajeros || 1,
                tarifa_extra: tarifa,
                descuento: descuento,
                total: total
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "No se pudo guardar la reserva");
        }

        return data.reserva;
    };

    const finalizarReserva = async (estado, mensaje) => {
        const btnConfirmar = document.getElementById("btn-confirmar-reserva");
        const btnGuardar = document.getElementById("btn-guardar-reserva");

        btnConfirmar.classList.add("deshabilitado");
        btnGuardar.classList.add("deshabilitado");

        const base = reserva.totalNumero;
        const tarifa = precioTarifa();
        const descuento = Math.round(base * 0.2);
        const total = base + tarifa - descuento;

        try {
            await guardarReservaEnBaseDatos(estado, total, tarifa, descuento);
            guardarReservaLocal(estado, total, tarifa, descuento);

            localStorage.removeItem("reservaEnProceso");
            mostrarAviso(mensaje);

            setTimeout(() => {
                window.location.href = "mis-reservas.html";
            }, 900);
        } catch (error) {
            console.error("Error guardando reserva:", error);

            btnConfirmar.classList.remove("deshabilitado");
            btnGuardar.classList.remove("deshabilitado");

            alert("No se pudo guardar la reserva en la base de datos. Revisa que el backend esté encendido.");
        }
    };

    // Número de reserva
    document.getElementById("reserva-numero-badge").textContent = "Reserva #" + reserva.numeroReserva;

    // Datos del pasajero
    const pasajero = obtenerDatosPasajero();

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
        finalizarReserva("Confirmada", "Reserva confirmada. Te llevamos a Mis reservas...");
    });

    document.getElementById("btn-guardar-reserva").addEventListener("click", (event) => {
        event.preventDefault();
        finalizarReserva("Pendiente", "Reserva guardada para después...");
    });
});
