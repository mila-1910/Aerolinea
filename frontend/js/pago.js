document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api";
    
    const reservaGuardada = localStorage.getItem("reservaEnProceso");
    if (!reservaGuardada) {
        window.location.href = "buscar-vuelos.html";
        return;
    }

    const reserva = JSON.parse(reservaGuardada);
    
    // Calcular total exacto (igual que en resumen-reserva.js)
    const precioTarifa = () => {
        if (reserva.clase === "Ejecutiva") return 890000;
        if (reserva.clase === "Primera clase") return 1300000;
        return 0;
    };
    
    const pasajerosCount = reserva.pasajeros || 1;
    const base = reserva.totalNumero;
    const tarifa = precioTarifa() * pasajerosCount;
    const descuento = Math.round(base * 0.2);
    const total = base + tarifa - descuento;
    
    const formatoCOP = (valor) => "$" + Number(valor).toLocaleString("es-CO") + " COP";
    
    // Actualizar UI
    document.getElementById("pago-plan-nombre").textContent = `Vuelo ${reserva.vuelo.numeroVuelo}`;
    
    // Fill new summary details
    document.getElementById("pago-fecha").textContent = reserva.vuelo.fechaTexto || reserva.vuelo.fecha;
    document.getElementById("pago-ruta").textContent = `${reserva.vuelo.origen} a ${reserva.vuelo.destino}`;
    document.getElementById("pago-clase").textContent = `Clase ${reserva.clase}`;
    document.getElementById("pago-pasajeros").textContent = reserva.pasajeros || 1;

    document.getElementById("pago-total-monto").textContent = formatoCOP(total);
    document.getElementById("btn-pay-amount").textContent = formatoCOP(total);
    
    // --- Lógica del Formulario de Pago ---
    const form = document.getElementById("payment-form");
    const cardNumberInput = document.getElementById("card-number");
    const cardExpInput = document.getElementById("card-exp");
    const errorContainer = document.getElementById("payment-error");
    const errorText = document.getElementById("payment-error-text");
    const btnPay = document.getElementById("btn-procesar-pago");
    const btnPayText = document.getElementById("btn-pay-text");
    const btnPayLoader = document.getElementById("btn-pay-loader");
    
    // Formateo de número de tarjeta
    cardNumberInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "");
        val = val.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = val;
        
        // Icono de marca
        const iconSpan = document.getElementById("card-brand-icon");
        if (val.startsWith("4")) {
            iconSpan.innerHTML = '<i class="fa-brands fa-cc-visa" style="color: #1A1F71;"></i>';
        } else if (val.startsWith("5")) {
            iconSpan.innerHTML = '<i class="fa-brands fa-cc-mastercard" style="color: #EB001B;"></i>';
        } else {
            iconSpan.innerHTML = '';
        }
    });
    
    // Formateo de fecha de expiración
    cardExpInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 2) {
            val = val.substring(0, 2) + "/" + val.substring(2, 4);
        }
        e.target.value = val;
    });
    
    const mostrarError = (mensaje) => {
        errorText.textContent = mensaje;
        errorContainer.style.display = "flex";
        
        // Reset animation trick
        errorContainer.style.animation = 'none';
        errorContainer.offsetHeight; // trigger reflow
        errorContainer.style.animation = null; 

        // Reset button
        btnPay.disabled = false;
        btnPayText.style.display = "inline-block";
        btnPayLoader.style.display = "none";
    };
    
    // Funciones de Base de Datos para guardar reserva
    const obtenerUsuario = () => JSON.parse(localStorage.getItem("usuario"));
    const obtenerDatosPasajero = () => {
        const usuario = obtenerUsuario();
        if (usuario) {
            return { nombre: usuario.nombre_completo, documento: usuario.id_cliente || "Pendiente", nacionalidad: "Colombiana", nacimiento: "Pendiente" };
        }
        return { nombre: "María González", documento: "123456789", nacionalidad: "Colombiana", nacimiento: "15/05/1990" };
    };
    
    const guardarReservaLocal = (estado, totalGuardar, tarifaGuardar, descuentoGuardar) => {
        const reservas = JSON.parse(localStorage.getItem("reservasCliente")) || [];
        const reservaLocal = {
            ...reserva,
            estado: estado,
            totalNumero: totalGuardar,
            totalTexto: formatoCOP(totalGuardar),
            tarifaExtra: tarifaGuardar,
            descuento: descuentoGuardar,
            pasajero: reserva.pasajerosLista && reserva.pasajerosLista.length > 0 
                ? { nombre: reserva.pasajerosLista[0].nombre_pasajero, documento: `${reserva.pasajerosLista[0].tipo_documento}: ${reserva.pasajerosLista[0].documento_pasajero}` } 
                : obtenerDatosPasajero(),
            tiquetes: reserva.pasajerosLista
        };
        const existe = reservas.some(item => item.numeroReserva === reservaLocal.numeroReserva);
        if (!existe) {
            reservas.push(reservaLocal);
            localStorage.setItem("reservasCliente", JSON.stringify(reservas));
        }
    };
    
    const guardarReservaEnBaseDatos = async (estado, totalGuardar, tarifaGuardar, descuentoGuardar) => {
        const usuario = obtenerUsuario();
        if (!usuario) throw new Error("No hay usuario activo");
        
        const response = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                numero_reserva: reserva.numeroReserva,
                id_usuario: usuario.id,
                id_cliente: usuario.id_cliente,
                id_vuelo: reserva.idVuelo,
                estado: estado,
                clase: reserva.clase,
                pasajeros: reserva.pasajerosLista || [],
                tarifa_extra: tarifaGuardar,
                descuento: descuentoGuardar,
                total: totalGuardar
            })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo guardar la reserva");
    };
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorContainer.style.display = "none";
        
        const rawCardNumber = cardNumberInput.value.replace(/\s/g, "");
        
        if (rawCardNumber.length < 15) {
            mostrarError("Número de tarjeta inválido.");
            return;
        }
        
        // Estado de carga
        btnPay.disabled = true;
        btnPayText.style.display = "none";
        btnPayLoader.style.display = "inline-block";
        
        // Simular latencia bancaria (2 segundos)
        await new Promise(r => setTimeout(r, 2000));
        
        // Reglas de validación (Las tarjetas de prueba del plan)
        const TARJETA_VISA = "4111111111111111";
        const TARJETA_MASTER = "5100010000000015";
        const TARJETA_RECHAZADA = "4970110000000062";
        const TARJETA_FALLIDA = "5204730000008404";
        
        if (rawCardNumber === TARJETA_VISA || rawCardNumber === TARJETA_MASTER) {
            // APROBADA
            try {
                await guardarReservaEnBaseDatos("Reservada", total, tarifa, descuento);
                guardarReservaLocal("Reservada", total, tarifa, descuento);
                localStorage.removeItem("reservaEnProceso");
                
                // Mostrar overlay de éxito
                const successOverlay = document.getElementById("success-overlay");
                successOverlay.style.display = "flex";
                setTimeout(() => successOverlay.classList.add("show"), 50);
                
                // Redirigir después de animación
                setTimeout(() => {
                    window.location.href = "mis-reservas.html";
                }, 2500);
                
            } catch (error) {
                console.error(error);
                mostrarError("Error del servidor: " + error.message);
            }
        } else if (rawCardNumber === TARJETA_RECHAZADA) {
            mostrarError("Transacción rechazada por el banco. Usa otra tarjeta.");
        } else if (rawCardNumber === TARJETA_FALLIDA) {
            mostrarError("Fondos insuficientes o tarjeta bloqueada.");
        } else {
            // Cualquier otra tarjeta la rechazamos por seguridad
            mostrarError("Tarjeta no reconocida. Utiliza los datos de prueba sugeridos.");
        }
    });
    
    // --- Lógica del Modal de Datos de Prueba ---
    const modal = document.getElementById("test-cards-modal");
    const fab = document.getElementById("fab-test-cards");
    const btnCloseModal = document.getElementById("btn-close-modal");
    
    const openModal = () => {
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add("show"), 10);
    };
    
    const closeModal = () => {
        modal.classList.remove("show");
        setTimeout(() => modal.style.display = "none", 250); // Mismo tiempo que la transición css
    };
    
    fab.addEventListener("click", openModal);
    btnCloseModal.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Copiar tarjetas
    document.querySelectorAll(".btn-copy").forEach(btn => {
        btn.addEventListener("click", () => {
            const cardNum = btn.getAttribute("data-card");
            navigator.clipboard.writeText(cardNum).then(() => {
                const toast = document.getElementById("toast-copied");
                toast.classList.add("show");
                setTimeout(() => toast.classList.remove("show"), 2000);
            });
        });
    });
});
