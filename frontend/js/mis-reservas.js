document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api";

    const tablaBody = document.getElementById("tabla-reservas-body");
    const tabs = document.querySelectorAll(".tab-reserva");
    const buscador = document.getElementById("buscar-reserva-input");
    const tablaContenedor = document.querySelector(".tabla-contenedor");

    const countTodas = document.getElementById("count-todas");
    const countPendientes = document.getElementById("count-pendientes");
    const countConfirmadas = document.getElementById("count-confirmadas");
    const countCanceladas = document.getElementById("count-canceladas");

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
        // Usuario que inició sesión
        const usuarioRaw = localStorage.getItem("usuario");

        if (!usuarioRaw) return null;

        return JSON.parse(usuarioRaw);
    };

    const formatoFecha = (fechaISO) => {
        const fecha = String(fechaISO).split("T")[0];
        const partes = fecha.split("-");

        const meses = {
            "01": "Ene",
            "02": "Feb",
            "03": "Mar",
            "04": "Abr",
            "05": "May",
            "06": "Jun",
            "07": "Jul",
            "08": "Ago",
            "09": "Sep",
            "10": "Oct",
            "11": "Nov",
            "12": "Dic"
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
            idReserva: item.id_reserva,
            numeroReserva: item.numero_reserva,
            estado: item.estado,
            clase: item.clase,
            pasajeros: item.pasajeros,
            totalNumero: item.total,
            descuento: item.descuento,
            tarifaExtra: item.tarifa_extra,
            vuelo: {
                idVuelo: item.id_vuelo,
                numeroVuelo: item.numero_vuelo,
                origen: item.origen,
                destino: item.destino,
                ciudad: item.ciudad_destino,
                fecha: String(item.fecha_salida).split("T")[0],
                fechaTexto: formatoFecha(item.fecha_salida),
                horaSalida: item.hora_salida,
                horaLlegada: item.hora_llegada,
                duracion: formatoDuracion(item.duracion_minutos),
                escala: item.escala,
                avion: item.tipo_avion,
                precioNumero: item.precio_base,
                imagen: item.imagen_url,
                ruta: `${item.origen} → ${item.destino}`
            }
        };
    };

    const claseEstado = (estado) => {
        if (estado === "Confirmada") return "confirmada";
        if (estado === "Pendiente") return "pendiente";
        if (estado === "Cancelada") return "cancelada";
        return "";
    };

    const actualizarContadores = () => {
        // Contadores de estados
        countTodas.textContent = reservas.length;
        countPendientes.textContent = reservas.filter(item => item.estado === "Pendiente").length;
        countConfirmadas.textContent = reservas.filter(item => item.estado === "Confirmada").length;
        countCanceladas.textContent = reservas.filter(item => item.estado === "Cancelada").length;
    };

    const guardarReservaSeleccionada = (reserva) => {
        // Reserva seleccionada para ver detalle
        localStorage.setItem("reservaSeleccionada", JSON.stringify(reserva));
        localStorage.setItem("reservaEnProceso", JSON.stringify(reserva));
    };

    const cancelarReserva = async (idReserva) => {
        try {
            // Cancela la reserva en Neon
            const response = await fetch(`${API_URL}/reservas/${idReserva}/cancelar`, {
                method: "PUT"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo cancelar la reserva");
            }

            reservas = reservas.map((reserva) => {
                if (reserva.idReserva === idReserva) {
                    return {
                        ...reserva,
                        estado: "Cancelada"
                    };
                }

                return reserva;
            });

            pintarReservas();
        } catch (error) {
            console.error("Error cancelando reserva:", error);
            alert("No se pudo cancelar la reserva. Revisa que el backend esté encendido.");
        }
    };

    const crearFila = (reserva) => {
        const fila = document.createElement("tr");
        const puedeCancelar = reserva.estado !== "Cancelada";

        fila.innerHTML = `
            <td>#${reserva.numeroReserva}</td>
            <td>${reserva.vuelo.numeroVuelo}</td>
            <td>${reserva.vuelo.origen} → ${reserva.vuelo.destino}</td>
            <td>${reserva.vuelo.fechaTexto}</td>
            <td>${reserva.clase}</td>
            <td><span class="estado ${claseEstado(reserva.estado)}">${reserva.estado}</span></td>
            <td>
                <div class="reserva-acciones">
                    <a href="resumen-reserva.html" class="btn-ver">Ver detalle</a>
                    ${puedeCancelar ? '<button class="btn-cancelar" type="button">Cancelar</button>' : ""}
                </div>
            </td>
        `;

        fila.querySelector(".btn-ver").addEventListener("click", () => {
            guardarReservaSeleccionada(reserva);
        });

        const btnCancelar = fila.querySelector(".btn-cancelar");

        if (btnCancelar) {
            btnCancelar.addEventListener("click", () => {
                cancelarReserva(reserva.idReserva);
            });
        }

        return fila;
    };

    const pintarReservas = () => {
        // Filtros de tabla
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

        tablaBody.innerHTML = "";

        filtradas.forEach((reserva) => {
            tablaBody.appendChild(crearFila(reserva));
        });

        tablaContenedor.classList.toggle("sin-datos", filtradas.length === 0);
        actualizarContadores();
    };

    const cargarReservasDesdeBaseDatos = async () => {
        const usuario = obtenerUsuario();

        if (!usuario) {
            tablaContenedor.classList.add("sin-datos");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reservas/usuario/${usuario.id}`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudieron cargar las reservas");
            }

            reservas = data.map(adaptarReservaApi);
            pintarReservas();
        } catch (error) {
            console.error("Error cargando reservas:", error);
            tablaContenedor.classList.add("sin-datos");
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            // Cambia filtro activo
            tabs.forEach(item => item.classList.remove("activo"));
            tab.classList.add("activo");

            estadoActivo = tab.dataset.estado;
            pintarReservas();
        });
    });

    buscador.addEventListener("input", pintarReservas);

    cargarReservasDesdeBaseDatos();
});