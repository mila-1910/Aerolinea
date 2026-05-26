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
                               style="width: 100%; padding: 10px; border-radius: 8px; background: #ffffff; border: 1px solid #cccccc; color: #000000; font-weight: bold; outline: none; font-size: 0.95rem;">
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <div class="form-group" style="flex: 1;">
                            <label style="display:block; font-size: 0.8rem; color: var(--gris-subtle); margin-bottom: 4px; font-weight: 500;">Tipo de Documento</label>
                            <select class="pasajero-input-tipo" data-pasajero="${i}" 
                                    style="width: 100%; padding: 10px; border-radius: 8px; background: #ffffff; border: 1px solid #cccccc; color: #000000; font-weight: bold; outline: none; font-size: 0.95rem; height: 41px;">
                                <option value="CC" selected>Cédula de Ciudadanía (CC)</option>
                                <option value="Pasaporte">Pasaporte</option>
                                <option value="CE">Cédula de Extranjería (CE)</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex: 2;">
                            <label style="display:block; font-size: 0.8rem; color: var(--gris-subtle); margin-bottom: 4px; font-weight: 500;">Número de Documento</label>
                            <input type="text" class="pasajero-input-doc" data-pasajero="${i}" placeholder="Ej: 10204928" value="${preDoc}" required 
                                   style="width: 100%; padding: 10px; border-radius: 8px; background: #ffffff; border: 1px solid #cccccc; color: #000000; font-weight: bold; outline: none; font-size: 0.95rem;">
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

    const initPage = async () => {
        const esReservaNueva = !reserva.idReserva;

        // Si es una reserva antigua, consultamos a la base de datos para obtener TODOS los detalles reales
        if (!esReservaNueva) {
            try {
                const response = await fetch(`${API_URL}/agente/reservas/${reserva.idReserva}`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Llenar datos faltantes con la base de datos
                    reserva.clase = data.tiquete ? data.tiquete.clase_tiquete : 'Económica';
                    reserva.pasajero = data.pasajero;
                    reserva.estado = data.estado || reserva.estado;

                    // Construir lista de tiquetes: preferir data.tiquetes (array), sino usar data.tiquete (singular)
                    let listaTiquetes = [];
                    if (data.tiquetes && Array.isArray(data.tiquetes) && data.tiquetes.length > 0) {
                        listaTiquetes = data.tiquetes;
                    } else if (data.tiquete) {
                        listaTiquetes = [data.tiquete];
                    }

                    // Enriquecer cada tiquete: si nombre_pasajero es null, usar el nombre del titular (pasajero/cliente)
                    const nombreTitular = data.pasajero ? data.pasajero.nombre : null;
                    const docTitular = data.pasajero ? data.pasajero.documento : null;

                    reserva.tiquetes = listaTiquetes.map((t, idx) => ({
                        ...t,
                        nombre_pasajero: t.nombre_pasajero || (idx === 0 ? nombreTitular : `Pasajero ${idx + 1}`),
                        documento_pasajero: t.documento_pasajero || (idx === 0 ? docTitular : 'Pendiente'),
                    }));

                    // Si no hay tiquetes en absoluto, crear uno virtual con los datos del titular
                    if (reserva.tiquetes.length === 0 && data.pasajero) {
                        reserva.tiquetes = [{
                            nombre_pasajero: nombreTitular || 'Pasajero Principal',
                            documento_pasajero: docTitular || 'Pendiente',
                            clase_tiquete: reserva.clase || 'Económica',
                            numero_asiento: 'Sin asignar'
                        }];
                    }
                    
                    if (data.vuelo) {
                        vuelo.duracion = vuelo.duracion || (data.vuelo.duracion_minutos ? Math.floor(data.vuelo.duracion_minutos / 60) + 'h' : '1h 0min');
                        vuelo.numeroVuelo = vuelo.numeroVuelo || data.vuelo.codigo || data.vuelo.cod_vuelo;
                        vuelo.escala = vuelo.escala || 'Directo';
                    }
                }
            } catch (err) {
                console.error("Error cargando detalle completo de la reserva:", err);
            }
        }

        // Asignar defaults para evitar crash
        reserva.clase = reserva.clase || 'Económica';
        vuelo.duracion = vuelo.duracion || '1h 0min';
        vuelo.numeroVuelo = vuelo.numeroVuelo || vuelo.codVuelo || 'N/A';
        vuelo.escala = vuelo.escala || 'Directo';

        // Número de reserva
        const numeroVisual = reserva.numeroReserva || reserva.idReserva || "Pendiente";
        const badgeNumero = document.getElementById("reserva-numero-badge");
        if(badgeNumero) badgeNumero.textContent = "Reserva #" + numeroVisual;

        // Renderizar los datos dinámicos de los pasajeros
        renderizarCamposPasajeros();

        // Datos del vuelo
        const getCityCode = (ciudad) => ciudad ? ciudad.substring(0, 3).toUpperCase() : "XXX";

        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        
        setVal("resumen-origen-codigo", getCityCode(vuelo.origen));
        setVal("resumen-origen", vuelo.origen);
        setVal("resumen-destino-codigo", getCityCode(vuelo.destino));
        setVal("resumen-destino", vuelo.destino);
        
        setVal("resumen-duracion", vuelo.duracion);
        setVal("resumen-vuelo", vuelo.numeroVuelo);
        setVal("resumen-fecha", vuelo.fechaTexto);
        setVal("resumen-escala", vuelo.escala);
        setVal("resumen-clase-bp", reserva.clase.toUpperCase());

        setVal("resumen-hora-salida", "10:30");
        setVal("resumen-llegada", "8:45 am");

        // Cálculo del pago
        const base = reserva.totalNumero || 0;
        const tarifa = esReservaNueva ? (precioTarifa() * pasajerosCount) : 0; // Si ya está pagada, la tarifa extra ya está en el total
        const descuento = esReservaNueva ? Math.round(base * 0.2) : 0;
        const total = esReservaNueva ? (base + tarifa - descuento) : base;

        setVal("resumen-clase", reserva.clase.toUpperCase());
        setVal("resumen-tarifa-precio", tarifa === 0 ? "Incluido" : formatoCOP(tarifa));
        
        // Beneficios dinámicos
        const beneficiosList = document.getElementById("resumen-beneficios-list");
        if (beneficiosList) {
            let beneficiosHTML = "";
            const claseLower = reserva.clase.toLowerCase();
            
            if (claseLower.includes("primera")) {
                beneficiosHTML = `
                    <li><i class="fa-solid fa-suitcase-rolling"></i> 3 maletas (32kg c/u)</li>
                    <li><i class="fa-solid fa-martini-glass-citrus"></i> Acceso a sala VIP Elite</li>
                    <li><i class="fa-solid fa-bed"></i> Asiento cama 180°</li>
                    <li><i class="fa-solid fa-utensils"></i> Menú de Chef privado</li>
                `;
            } else if (claseLower.includes("ejecutiva")) {
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
        }

        setVal("pago-vuelo", formatoCOP(base));
        setVal("pago-tarifa-label", `Tarifa ${reserva.clase.toLowerCase()} (x${pasajerosCount})`);
        setVal("pago-tarifa", tarifa === 0 ? "Incluido" : formatoCOP(tarifa));
        
        const descEl = document.getElementById("pago-descuento");
        if (descEl) {
            if (descuento > 0) {
                descEl.textContent = "-" + formatoCOP(descuento);
            } else {
                descEl.textContent = "$0 COP";
            }
        }
        
        setVal("pago-total", formatoCOP(total));

        const btnConfirmar = document.getElementById("btn-confirmar-reserva");
        const btnGuardar = document.getElementById("btn-guardar-reserva");

        if (btnConfirmar) {
            btnConfirmar.addEventListener("click", (event) => {
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
        }

        if (btnGuardar) {
            btnGuardar.addEventListener("click", (event) => {
                event.preventDefault();
                if (esReservaNueva) {
                    // Validar formularios dinámicos
                    if (!guardarPasajerosDesdeForm()) return;
                    finalizarReserva("Pendiente", "Reserva guardada para después...");
                } else {
                    window.location.href = "mis-reservas.html";
                }
            });
        }

        // Gestión de estado visual
        const badge = document.getElementById("reserva-estado-badge");
        const titulo = document.getElementById("resumen-hero-title");
        const subtitulo = document.getElementById("resumen-hero-subtitle");
        const botonesContainer = document.getElementById("resumen-botones-container");

        if (!esReservaNueva && badge && titulo && subtitulo && botonesContainer) {
            badge.style.display = "inline-block";
            badge.textContent = (reserva.estado || 'Reservada').toUpperCase();
            
            let color, bg;
            if (reserva.estado === "Confirmada") { color = "#0f5132"; bg = "#d1e7dd"; }
            else if (reserva.estado === "Pendiente" || reserva.estado === "Reservada") { color = "#664d03"; bg = "#fff3cd"; }
            else if (reserva.estado === "Cancelada") { color = "#842029"; bg = "#f8d7da"; }
            else { color = "#0f5132"; bg = "#d1e7dd"; } // Default to Confirmada
            
            badge.style.color = color;
            badge.style.backgroundColor = bg;

            titulo.textContent = "Detalle de tu reserva";
            subtitulo.textContent = "Aquí tienes la información completa de tu vuelo y facturación.";

            if (reserva.estado === "Confirmada") {
                // Inyectar encabezado solo visible al imprimir
                const printHeader = document.createElement('div');
                printHeader.id = 'print-header';
                printHeader.style.cssText = 'display:none;';
                printHeader.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 3px solid #1a1a2e; margin-bottom: 16px;">
                        <div>
                            <img src="../../imagenes/logo-dorado.png" alt="ELARIS" height="45" style="margin-bottom: 4px;">
                            <div style="font-size: 8pt; color: #888; letter-spacing: 1px;">BOARDING PASS & RECEIPT</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 14pt; font-weight: 800; color: #1a1a2e;">Reserva #${reserva.numeroReserva || reserva.idReserva}</div>
                            <div style="display: inline-block; background: #d1e7dd; color: #0f5132; padding: 3px 10px; border-radius: 12px; font-size: 8pt; font-weight: 700; letter-spacing: 1px;">CONFIRMADA</div>
                            <div style="font-size: 8pt; color: #888; margin-top: 4px;">${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>
                    <div style="font-size: 9pt; color: #555; margin-bottom: 12px;">
                        <strong>Titular:</strong> ${reserva.pasajero ? reserva.pasajero.nombre : 'N/A'} &nbsp;|&nbsp; 
                        <strong>Documento:</strong> ${reserva.pasajero ? reserva.pasajero.documento : 'N/A'} &nbsp;|&nbsp;
                        <strong>Email:</strong> ${reserva.pasajero ? reserva.pasajero.email : 'N/A'}
                    </div>
                `;
                const contenedor = document.getElementById('resumen-contenedor');
                if (contenedor) contenedor.prepend(printHeader);

                botonesContainer.innerHTML = `
                    <a href="#" class="btn-premium-confirm" id="btn-descargar-bp">
                        <i class="fa-solid fa-download"></i> Descargar Boarding Pass
                    </a>
                    <a href="mis-reservas.html" class="btn-premium-outline">
                        <i class="fa-solid fa-arrow-left"></i> Volver a mis reservas
                    </a>
                `;

                document.getElementById('btn-descargar-bp').addEventListener('click', (e) => {
                    e.preventDefault();
                    // Mostrar header de impresión y cambiar título
                    const ph = document.getElementById('print-header');
                    if (ph) ph.style.display = 'block';
                    const oldTitle = document.title;
                    document.title = `ELARIS_BoardingPass_${reserva.numeroReserva || reserva.idReserva}`;
                    window.print();
                    document.title = oldTitle;
                    if (ph) ph.style.display = 'none';
                });
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
        } else if (esReservaNueva && badge && titulo && subtitulo) {
            titulo.textContent = "Resumen de tu reserva";
            subtitulo.textContent = "Revisa los detalles de tu vuelo de élite antes de confirmar.";
            badge.style.display = "none";
        }
    };

    // Ejecutar la inicialización
    initPage();
});
