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
    // Funciones para código de ciudad (3 letras MAYUSCULA)
    const getCityCode = (ciudad) => ciudad ? ciudad.substring(0, 3).toUpperCase() : "XXX";

    document.getElementById("resumen-origen-codigo").textContent = getCityCode(vuelo.origen);
    document.getElementById("resumen-origen").textContent = vuelo.origen;
    document.getElementById("resumen-destino-codigo").textContent = getCityCode(vuelo.destino);
    document.getElementById("resumen-destino").textContent = vuelo.destino;
    
    document.getElementById("resumen-duracion").textContent = vuelo.duracion;
    document.getElementById("resumen-vuelo").textContent = vuelo.numeroVuelo;
    document.getElementById("resumen-fecha").textContent = vuelo.fechaTexto;
    document.getElementById("resumen-escala").textContent = vuelo.escala;
    document.getElementById("resumen-clase-bp").textContent = reserva.clase.toUpperCase();

    document.getElementById("resumen-hora-salida").textContent = "10:30";
    document.getElementById("resumen-llegada").textContent = "8:45 am";

    // Cálculo del pago
    const base = reserva.totalNumero;
    const tarifa = precioTarifa();
    const descuento = Math.round(base * 0.2);
    const total = base + tarifa - descuento;

    document.getElementById("resumen-clase").textContent = reserva.clase.toUpperCase();
    document.getElementById("resumen-tarifa-precio").textContent = tarifa === 0 ? "Incluido" : formatoCOP(tarifa);
    
    // Beneficios dinámicos
    const beneficiosList = document.getElementById("resumen-beneficios-list");
    let beneficiosHTML = "";
    
    if (reserva.clase === "Primera clase") {
        beneficiosHTML = `
            <li><i class="fa-solid fa-suitcase-rolling"></i> 3 maletas (32kg c/u)</li>
            <li><i class="fa-solid fa-martini-glass-citrus"></i> Acceso a sala VIP Elite</li>
            <li><i class="fa-solid fa-bed"></i> Asiento cama 180°</li>
            <li><i class="fa-solid fa-utensils"></i> Menú de Chef privado</li>
        `;
    } else if (reserva.clase === "Ejecutiva") {
        beneficiosHTML = `
            <li><i class="fa-solid fa-suitcase-rolling"></i> 2 maletas (23kg c/u)</li>
            <li><i class="fa-solid fa-martini-glass-citrus"></i> Acceso a sala VIP</li>
            <li><i class="fa-solid fa-couch"></i> Asiento preferencial amplio</li>
            <li><i class="fa-solid fa-utensils"></i> Menú a la carta</li>
        `;
    } else {
        // Económica
        beneficiosHTML = `
            <li><i class="fa-solid fa-suitcase"></i> 1 maleta de mano (10kg)</li>
            <li><i class="fa-solid fa-bag-shopping"></i> Artículo personal</li>
            <li><i class="fa-solid fa-chair"></i> Asiento estándar</li>
            <li><i class="fa-solid fa-mug-hot"></i> Bebida de cortesía</li>
        `;
    }
    beneficiosList.innerHTML = beneficiosHTML;

    document.getElementById("pago-vuelo").textContent = formatoCOP(base);
    document.getElementById("pago-tarifa-label").textContent = "Tarifa " + reserva.clase.toLowerCase();
    document.getElementById("pago-tarifa").textContent = tarifa === 0 ? "Incluido" : formatoCOP(tarifa);
    
    if (descuento > 0) {
        document.getElementById("pago-descuento").textContent = "-" + formatoCOP(descuento);
    } else {
        document.getElementById("pago-descuento").textContent = "$0 COP";
    }
    
    document.getElementById("pago-total").textContent = formatoCOP(total);

    const esReservaNueva = !reserva.idReserva; // Si no tiene ID de DB, es nueva

    document.getElementById("btn-confirmar-reserva").addEventListener("click", (event) => {
        event.preventDefault();
        finalizarReserva("Confirmada", "Reserva confirmada. Te llevamos a Mis reservas...");
    });

    document.getElementById("btn-guardar-reserva").addEventListener("click", (event) => {
        event.preventDefault();
        if (esReservaNueva) {
            // Es una reserva nueva que el usuario quiere dejar "Pendiente"
            finalizarReserva("Pendiente", "Reserva guardada para después...");
        } else {
            // Ya existe y está guardada, simplemente volvemos
            window.location.href = "mis-reservas.html";
        }
    });

    // Gestión de estado visual
    const badge = document.getElementById("reserva-estado-badge");
    const titulo = document.getElementById("resumen-hero-title");
    const subtitulo = document.getElementById("resumen-hero-subtitle");
    const botonesContainer = document.getElementById("resumen-botones-container");

    if (!esReservaNueva) {
        // Es una reserva EXISTENTE (viene de Mis Reservas)
        badge.style.display = "inline-block";
        badge.textContent = reserva.estado.toUpperCase();
        
        let color, bg;
        if (reserva.estado === "Confirmada") { color = "#0f5132"; bg = "#d1e7dd"; }
        else if (reserva.estado === "Pendiente") { color = "#664d03"; bg = "#fff3cd"; }
        else if (reserva.estado === "Cancelada") { color = "#842029"; bg = "#f8d7da"; }
        
        badge.style.color = color;
        badge.style.backgroundColor = bg;

        titulo.textContent = "Detalle de tu reserva";
        subtitulo.textContent = "Aquí tienes la información completa de tu vuelo y facturación.";

        if (reserva.estado === "Confirmada") {
            botonesContainer.innerHTML = `
                <a href="#" class="btn-premium-confirm" onclick="window.print(); return false;">
                    <i class="fa-solid fa-download"></i> Descargar Boarding Pass
                </a>
                <a href="mis-reservas.html" class="btn-premium-outline">
                    <i class="fa-solid fa-arrow-left"></i> Volver a mis reservas
                </a>
            `;
        } else if (reserva.estado === "Cancelada") {
            botonesContainer.innerHTML = `
                <a href="buscar-vuelos.html" class="btn-premium-confirm">
                    <i class="fa-solid fa-plane"></i> Buscar Nuevo Vuelo
                </a>
                <a href="mis-reservas.html" class="btn-premium-outline">
                    <i class="fa-solid fa-arrow-left"></i> Volver a mis reservas
                </a>
            `;
        } else if (reserva.estado === "Pendiente") {
            document.getElementById("btn-confirmar-reserva").innerHTML = `Pagar Ahora <i class="fa-solid fa-credit-card"></i>`;
            document.getElementById("btn-guardar-reserva").innerHTML = `<i class="fa-solid fa-arrow-left"></i> Volver a mis reservas`;
        }
    } else {
        // Es una reserva NUEVA
        titulo.textContent = "Resumen de tu reserva";
        subtitulo.textContent = "Revisa los detalles de tu vuelo de élite antes de confirmar.";
        badge.style.display = "none";
        // Los botones ya están por defecto ("Confirmar y Pagar", "Guardar para después")
    }
});
