document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tabla-reservas-body");
    const tabs = document.querySelectorAll(".tab-reserva");
    const buscador = document.getElementById("buscar-reserva-input");
    const tablaContenedor = document.querySelector(".tabla-contenedor");

    const countTodas = document.getElementById("count-todas");
    const countPendientes = document.getElementById("count-pendientes");
    const countConfirmadas = document.getElementById("count-confirmadas");
    const countCanceladas = document.getElementById("count-canceladas");

    const reservasEjemplo = [
        {
            numeroReserva: "RES-001",
            estado: "Confirmada",
            clase: "Económica",
            vuelo: {
                numeroVuelo: "EL-204",
                origen: "Bogotá",
                destino: "Nueva York",
                fechaTexto: "15 Abr 2026"
            }
        },
        {
            numeroReserva: "RES-002",
            estado: "Pendiente",
            clase: "Ejecutiva",
            vuelo: {
                numeroVuelo: "EL-310",
                origen: "Medellín",
                destino: "Cancún",
                fechaTexto: "22 May 2026"
            }
        },
        {
            numeroReserva: "RES-003",
            estado: "Cancelada",
            clase: "Primera clase",
            vuelo: {
                numeroVuelo: "EL-105",
                origen: "Cali",
                destino: "Madrid",
                fechaTexto: "10 Jun 2026"
            }
        },
        {
            numeroReserva: "RES-004",
            estado: "Confirmada",
            clase: "Económica",
            vuelo: {
                numeroVuelo: "EL-422",
                origen: "Bogotá",
                destino: "París",
                fechaTexto: "5 Jul 2026"
            }
        }
    ];

    let estadoActivo = "Todas";

    const normalizar = (texto) => {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const obtenerReservas = () => {
        // Reservas guardadas desde el resumen
        const reservasGuardadas = JSON.parse(localStorage.getItem("reservasCliente")) || [];

        if (reservasGuardadas.length > 0) {
            return reservasGuardadas;
        }

        return reservasEjemplo;
    };

    const guardarReservas = (reservas) => {
        // Actualiza reservas locales
        localStorage.setItem("reservasCliente", JSON.stringify(reservas));
    };

    const claseEstado = (estado) => {
        if (estado === "Confirmada") return "confirmada";
        if (estado === "Pendiente") return "pendiente";
        if (estado === "Cancelada") return "cancelada";
        return "";
    };

    const actualizarContadores = () => {
        // Contadores de estados
        const reservas = obtenerReservas();

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

    const cancelarReserva = (numeroReserva) => {
        // Cancela una reserva guardada
        let reservas = obtenerReservas();

        reservas = reservas.map((reserva) => {
            if (reserva.numeroReserva === numeroReserva) {
                return {
                    ...reserva,
                    estado: "Cancelada"
                };
            }

            return reserva;
        });

        guardarReservas(reservas);
        pintarReservas();
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
                cancelarReserva(reserva.numeroReserva);
            });
        }

        return fila;
    };

    const pintarReservas = () => {
        // Filtros de tabla
        const textoBusqueda = normalizar(buscador.value);
        const reservas = obtenerReservas();

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

    pintarReservas();
});
