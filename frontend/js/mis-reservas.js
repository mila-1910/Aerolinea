document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api";

    const gridContenedor = document.getElementById("tabla-reservas-body");
    const tabs = document.querySelectorAll(".segment-btn");
    const buscador = document.getElementById("buscar-reserva-input");
    const mainContenedor = document.querySelector(".reservas-grid-contenedor");

    const countTodas     = document.getElementById("count-todas");
    const countReservadas  = document.getElementById("count-reservadas");
    const countConfirmadas = document.getElementById("count-confirmadas");
    const countCanceladas  = document.getElementById("count-canceladas");

    let estadoActivo = "Todas";
    let reservas = [];

    const normalizar = (texto) => {
        return String(texto)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const obtenerUsuario = () => {
        const usuarioRaw = localStorage.getItem("usuario");
        if (!usuarioRaw) return null;
        return JSON.parse(usuarioRaw);
    };

    const formatoFecha = (fechaISO) => {
        const fecha = String(fechaISO).split("T")[0];
        const partes = fecha.split("-");
        const meses = {
            "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
            "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
            "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic"
        };
        return `${Number(partes[2])} ${meses[partes[1]]} ${partes[0]}`;
    };

    const formatoDuracion = (minutos) => {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (mins === 0) return `${horas}h`;
        return `${horas}h ${mins}min`;
    };

    const adaptarReservaApi = (item) => {
        return {
            idReserva:   item.id_reserva,
            estado:      item.estado,
            totalNumero: item.valor_total,
            vuelo: {
                idVuelo:      item.id_vuelo,
                codVuelo:     item.cod_vuelo,
                origen:       item.ciudad_origen,
                destino:      item.ciudad_destino,
                fechaSalida:  item.fecha_hora_salida,
                fechaTexto:   formatoFecha(item.fecha_hora_salida),
                precioNumero: item.precio_base,
                ruta: `${item.ciudad_origen} \u2192 ${item.ciudad_destino}`
            }
        };
    };

    const claseEstado = (estado) => {
        if (estado === "Confirmada")  return "confirmada";
        if (estado === "Reservada")   return "pendiente";   // reutiliza estilo visual amarillo
        if (estado === "Cancelada")   return "cancelada";
        if (estado === "Expirada")    return "cancelada";
        return "";
    };

    const actualizarContadores = () => {
        countTodas.textContent       = reservas.length;
        countReservadas.textContent  = reservas.filter(r => r.estado === "Reservada").length;
        countConfirmadas.textContent = reservas.filter(r => r.estado === "Confirmada").length;
        countCanceladas.textContent  = reservas.filter(r => r.estado === "Cancelada").length;
    };

    const guardarReservaSeleccionada = (reserva) => {
        localStorage.setItem("reservaSeleccionada", JSON.stringify(reserva));
        localStorage.setItem("reservaEnProceso", JSON.stringify(reserva));
    };

    const cancelarReserva = async (idReserva) => {
        try {
            const response = await fetch(`${API_URL}/reservas/${idReserva}/cancelar`, {
                method: "PUT"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo cancelar la reserva");
            }

            reservas = reservas.map((reserva) => {
                if (reserva.idReserva === idReserva) {
                    return { ...reserva, estado: "Cancelada" };
                }
                return reserva;
            });

            pintarReservas();
        } catch (error) {
            console.error("Error cancelando reserva:", error);
            alert("No se pudo cancelar la reserva. Revisa que el backend esté encendido.");
        }
    };

    const crearTarjetaReserva = (reserva, index) => {
        const div = document.createElement("div");
        div.className = "reserva-card";
        
        // Emil Kowalski stagger effect
        div.style.animationDelay = `${index * 0.06}s`;

        const puedeCancelar = reserva.estado !== "Cancelada";

        div.innerHTML = `
            <div class="card-header">
                <div class="card-meta">
                    <span class="reserva-id">Reserva #${reserva.idReserva}</span>
                    <span class="reserva-fecha">${reserva.vuelo.fechaTexto}</span>
                </div>
                <span class="estado-badge estado ${claseEstado(reserva.estado)}">${reserva.estado}</span>
            </div>

            <div class="card-route">
                <div class="route-point origin">
                    <div class="route-city">${reserva.vuelo.origen}</div>
                </div>
                <div class="route-icon"><i class="fa-solid fa-plane"></i></div>
                <div class="route-point destination">
                    <div class="route-city">${reserva.vuelo.destino}</div>
                </div>
            </div>

            <div class="card-info">
                <div class="info-item">
                    <span class="info-label">Vuelo</span>
                    <span class="info-value">${reserva.vuelo.codVuelo}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Total</span>
                    <span class="info-value">${new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(reserva.totalNumero)}</span>
                </div>
            </div>

            <div class="card-actions">
                <a href="resumen-reserva.html" class="btn-card secondary-btn btn-ver">Ver Detalle</a>
                ${puedeCancelar ? '<button class="btn-card danger-btn btn-cancelar">Cancelar</button>' : ''}
            </div>
        `;

        div.querySelector(".btn-ver").addEventListener("click", () => {
            guardarReservaSeleccionada(reserva);
        });

        const btnCancelar = div.querySelector(".btn-cancelar");
        if (btnCancelar) {
            btnCancelar.addEventListener("click", () => {
                cancelarReserva(reserva.idReserva);
            });
        }

        return div;
    };

    const pintarReservas = () => {
        const actualizarDOM = () => {
            const textoBusqueda = normalizar(buscador.value);

            const filtradas = reservas.filter((reserva) => {
                const textoReserva = normalizar(`
                    ${reserva.numeroReserva}
                    ${reserva.vuelo.numeroVuelo}
                    ${reserva.vuelo.origen}
                    ${reserva.vuelo.destino}
                    ${reserva.estado}
                    ${reserva.clase}
                `);

                const pasaEstado = estadoActivo === "Todas" || reserva.estado === estadoActivo;
                const pasaBusqueda = textoBusqueda === "" || textoReserva.includes(textoBusqueda);

                return pasaEstado && pasaBusqueda;
            });

            gridContenedor.innerHTML = "";

            filtradas.forEach((reserva, index) => {
                gridContenedor.appendChild(crearTarjetaReserva(reserva, index));
            });

            mainContenedor.classList.toggle("grid-empty", filtradas.length === 0);
            actualizarContadores();
        };

        // Usa View Transitions API para animaciones suaves (Emil Kowalski style)
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                actualizarDOM();
            });
        } else {
            actualizarDOM();
        }
    };

    const cargarReservasDesdeBaseDatos = async () => {
        const usuario = obtenerUsuario();

        if (!usuario || !usuario.id_cliente) {
            mainContenedor.classList.add("grid-empty");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reservas/cliente/${usuario.id_cliente}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudieron cargar las reservas");
            }

            reservas = data.map(adaptarReservaApi);
            pintarReservas();
        } catch (error) {
            console.error("Error cargando reservas:", error);
            mainContenedor.classList.add("grid-empty");
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach(item => item.classList.remove("active"));
            tab.classList.add("active");
            estadoActivo = tab.dataset.estado;
            pintarReservas();
        });
    });

    let debounceTimer;
    buscador.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            pintarReservas();
        }, 400);
    });

    const btnGrid = document.getElementById("btn-grid");
    const btnCompact = document.getElementById("btn-compact");
    const gridEl = document.querySelector(".reservas-grid");

    const setView = (viewType) => {
        const actualizarVista = () => {
            if (viewType === "compact") {
                gridEl.classList.add("vista-compacta");
                btnCompact.classList.add("active");
                btnGrid.classList.remove("active");
                localStorage.setItem("elaris_reservas_view", "compact");
            } else {
                gridEl.classList.remove("vista-compacta");
                btnGrid.classList.add("active");
                btnCompact.classList.remove("active");
                localStorage.setItem("elaris_reservas_view", "grid");
            }
        };

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                actualizarVista();
            });
        } else {
            actualizarVista();
        }
    };

    btnGrid.addEventListener("click", () => setView("grid"));
    btnCompact.addEventListener("click", () => setView("compact"));

    // Initialize view from local storage
    const savedView = localStorage.getItem("elaris_reservas_view") || "grid";
    setView(savedView);

    cargarReservasDesdeBaseDatos();
});