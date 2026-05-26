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

    const pasajerosCount = reserva.pasajeros || 1;

    const mostrarAviso = (mensaje) => {
        const aviso = document.createElement("div");
        aviso.className = "aviso-resumen";
        aviso.textContent = mensaje;

        document.body.appendChild(aviso);

        setTimeout(() => {
            aviso.classList.add("activo");
        }, 50);
    };

    const obtenerUsuario = () => {
        const usuarioRaw = localStorage.getItem("usuario");
        if (!usuarioRaw) return null;
        return JSON.parse(usuarioRaw);
    };

    const obtenerDatosPasajero = () => {
        const usuario = obtenerUsuario();
        if (usuario) {
            return {
                nombre: usuario.nombre_completo,
                documento: usuario.id_cliente || "Pendiente",
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

    // Renderizar formularios dinámicos para los pasajeros
    const renderizarCamposPasajeros = () => {
        const container = document.getElementById("pasajeros-dinamicos-contenedor");
        if (!container) return;

        container.innerHTML = "";

        const esNueva = !reserva.idReserva;

        if (!esNueva) {
            // Modo lectura: Si ya existe en la base de datos
            const lista = reserva.tiquetes || (reserva.pasajero ? [reserva.pasajero] : []);
            
            lista.forEach((p, idx) => {
                const pDiv = document.createElement("div");
                pDiv.className = "pasajero-list";
                pDiv.style.padding = "10px 0";
                if (idx > 0) {
                    pDiv.style.borderTop = "1px solid rgba(255,255,255,0.1)";
                    pDiv.style.marginTop = "15px";
                    pDiv.style.paddingTop = "15px";
                }
                
                const nombrePas = p.nombre_pasajero || p.nombre || "Pasajero Principal";
                const docPas = p.documento_pasajero || p.documento || "CC: Pendiente";
                const clasePas = p.clase_tiquete || reserva.clase || 'Económica';
                const asientoPas = p.numero_asiento || 'Sin asignar';
                
                pDiv.innerHTML = `
                    <h4 style="color: var(--oro-premium); margin-bottom: 8px; font-weight: 700;">
                        <i class="fa-solid fa-ticket"></i> Pasajero ${idx + 1} (${clasePas.toUpperCase()})
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="pasajero-item">
                            <span class="p-label" style="font-size: 0.75rem; color: var(--gris-subtle); display: block;">Nombre Completo</span>
                            <span class="p-value" style="font-weight: 600;">${nombrePas}</span>
                        </div>
                        <div class="pasajero-item">
                            <span class="p-label" style="font-size: 0.75rem; color: var(--gris-subtle); display: block;">Documento de Identidad</span>
                            <span class="p-value" style="font-weight: 600;">${docPas}</span>
                        </div>
                        <div class="pasajero-item" style="grid-column: span 2; margin-top: 5px;">
                            <span class="p-label" style="font-size: 0.75rem; color: var(--gris-subtle); display: block;">Asiento Asignado</span>
                            <span class="p-value" style="font-weight: bold; color: ${asientoPas !== 'Sin asignar' ? '#2ec4b6' : 'var(--gris-subtle)'};">
                                <i class="fa-solid fa-chair"></i> ${asientoPas}
                            </span>
                        </div>
                    </div>
                `;
                container.appendChild(pDiv);
            });
            return;
        }

        // Modo edición: Si es una nueva reserva que se va a pagar o guardar
        const usuario = obtenerUsuario();

        for (let i = 1; i <= pasajerosCount; i++) {
            const formDiv = document.createElement("div");
            formDiv.className = "pasajero-form-card";
            formDiv.style.padding = "10px 0";
            if (i > 1) {
                formDiv.style.borderTop = "1px dashed rgba(255,255,255,0.2)";
                formDiv.style.marginTop = "20px";
                formDiv.style.paddingTop = "20px";
            }

            let preNombre = "";
            let preDoc = "";

            if (i === 1 && usuario) {
                preNombre = usuario.nombre_completo || "";
                preDoc = usuario.id_cliente || "";
            }

            formDiv.innerHTML = `
                <h4 style="color: var(--oro-premium); margin-bottom: 12px; font-weight: 700;">
                    <i class="fa-solid fa-user"></i> Datos del Pasajero ${i} ${i === 1 ? '(Titular de la cuenta)' : ''}
                </h4>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div class="form-group">
                        <label style="display:block; font-size: 0.8rem; color: var(--gris-subtle); margin-bottom: 4px; font-weight: 500;">Nombres y Apellidos Completos</label>
                        <input type="text" class="pasajero-input-nombre" data-pasajero="${i}" placeholder="Ej: Juan Pérez" value="${preNombre}" required 
                               style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; font-size: 0.9rem;">
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <div class="form-group" style="flex: 1;">
                            <label style="display:block; font-size: 0.8rem; color: var(--gris-subtle); margin-bottom: 4px; font-weight: 500;">Tipo de Documento</label>
                            <select class="pasajero-input-tipo" data-pasajero="${i}" 
                                    style="width: 100%; padding: 10px; border-radius: 8px; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; font-size: 0.9rem; height: 41px;">
                                <option value="CC" selected>Cédula de Ciudadanía (CC)</option>
                                <option value="Pasaporte">Pasaporte</option>
                                <option value="CE">Cédula de Extranjería (CE)</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex: 2;">
                            <label style="display:block; font-size: 0.8rem; color: var(--gris-subtle); margin-bottom: 4px; font-weight: 500;">Número de Documento</label>
                            <input type="text" class="pasajero-input-doc" data-pasajero="${i}" placeholder="Ej: 10204928" value="${preDoc}" required 
                                   style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; font-size: 0.9rem;">
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(formDiv);
        }
    };

    // Validar y recolectar datos de los pasajeros
    const guardarPasajerosDesdeForm = () => {
        const list = [];
        
        for (let i = 1; i <= pasajerosCount; i++) {
            const nombreVal = document.querySelector(`.pasajero-input-nombre[data-pasajero="${i}"]`).value.trim();
            const tipoVal = document.querySelector(`.pasajero-input-tipo[data-pasajero="${i}"]`).value;
            const docVal = document.querySelector(`.pasajero-input-doc[data-pasajero="${i}"]`).value.trim();
            
            if (!nombreVal || !docVal) {
                alert(`Por favor completa el nombre y documento del Pasajero ${i}`);
                return false;
            }
            
            list.push({
                nombre_pasajero: nombreVal,
                documento_pasajero: docVal,
                tipo_documento: tipoVal
            });
        }
        
        reserva.pasajerosLista = list;
        localStorage.setItem("reservaEnProceso", JSON.stringify(reserva));
        return true;
    };

    const guardarReservaLocal = (estado, total, tarifa, descuento) => {
        const reservas = JSON.parse(localStorage.getItem("reservasCliente")) || [];

        const reservaLocal = {
            ...reserva,
            estado: estado,
            totalNumero: total,
            totalTexto: formatoCOP(total),
            tarifaExtra: tarifa,
            descuento: descuento,
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

        return reservaLocal;
    };

    const guardarReservaEnBaseDatos = async (estado, total, tarifa, descuento) => {
        const usuario = obtenerUsuario();

        if (!usuario) {
            throw new Error("No hay usuario activo");
        }

        const response = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                numero_reserva: reserva.numeroReserva,
                id_usuario: usuario.id,
                id_cliente: usuario.id_cliente,
                id_vuelo: reserva.idVuelo,
                estado: estado, // Estado inicial: "Reservada" (ID 1)
                clase: reserva.clase,
                pasajeros: reserva.pasajerosLista || [],
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
        const tarifa = precioTarifa() * pasajerosCount; // Upgrade extra cobrado por pasajero
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

    // Renderizar los datos dinámicos de los pasajeros
    renderizarCamposPasajeros();

    // Datos del vuelo
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
    const tarifa = precioTarifa() * pasajerosCount; // Upgrade extra cobrado por pasajero
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
        beneficiosHTML = `
            <li><i class="fa-solid fa-suitcase"></i> 1 maleta de mano (10kg)</li>
            <li><i class="fa-solid fa-bag-shopping"></i> Artículo personal</li>
            <li><i class="fa-solid fa-chair"></i> Asiento estándar</li>
            <li><i class="fa-solid fa-mug-hot"></i> Bebida de cortesía</li>
        `;
    }
    beneficiosList.innerHTML = beneficiosHTML;

    document.getElementById("pago-vuelo").textContent = formatoCOP(base);
    document.getElementById("pago-tarifa-label").textContent = `Tarifa ${reserva.clase.toLowerCase()} (x${pasajerosCount})`;
    document.getElementById("pago-tarifa").textContent = tarifa === 0 ? "Incluido" : formatoCOP(tarifa);
    
    if (descuento > 0) {
        document.getElementById("pago-descuento").textContent = "-" + formatoCOP(descuento);
    } else {
        document.getElementById("pago-descuento").textContent = "$0 COP";
    }
    
    document.getElementById("pago-total").textContent = formatoCOP(total);

    const esReservaNueva = !reserva.idReserva;

    document.getElementById("btn-confirmar-reserva").addEventListener("click", (event) => {
        event.preventDefault();
        if (esReservaNueva) {
            // Validar formularios dinámicos
            if (!guardarPasajerosDesdeForm()) return;
            window.location.href = "pago.html";
        } else if (reserva.estado === "Pendiente") {
            window.location.href = "pago.html";
        } else {
            finalizarReserva("Confirmada", "Reserva confirmada. Te llevamos a Mis reservas...");
        }
    });

    document.getElementById("btn-guardar-reserva").addEventListener("click", (event) => {
        event.preventDefault();
        if (esReservaNueva) {
            // Validar formularios dinámicos
            if (!guardarPasajerosDesdeForm()) return;
            finalizarReserva("Pendiente", "Reserva guardada para después...");
        } else {
            window.location.href = "mis-reservas.html";
        }
    });

    // Gestión de estado visual
    const badge = document.getElementById("reserva-estado-badge");
    const titulo = document.getElementById("resumen-hero-title");
    const subtitulo = document.getElementById("resumen-hero-subtitle");
    const botonesContainer = document.getElementById("resumen-botones-container");

    if (!esReservaNueva) {
        badge.style.display = "inline-block";
        badge.textContent = reserva.estado.toUpperCase();
        
        let color, bg;
        if (reserva.estado === "Confirmada") { color = "#0f5132"; bg = "#d1e7dd"; }
        else if (reserva.estado === "Pendiente" || reserva.estado === "Reservada") { color = "#664d03"; bg = "#fff3cd"; }
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
        } else if (reserva.estado === "Pendiente" || reserva.estado === "Reservada") {
            document.getElementById("btn-confirmar-reserva").innerHTML = `Pagar Ahora <i class="fa-solid fa-credit-card"></i>`;
            document.getElementById("btn-guardar-reserva").innerHTML = `<i class="fa-solid fa-arrow-left"></i> Volver a mis reservas`;
        }
    } else {
        titulo.textContent = "Resumen de tu reserva";
        subtitulo.textContent = "Revisa los detalles de tu vuelo de élite antes de confirmar.";
        badge.style.display = "none";
    }
});
