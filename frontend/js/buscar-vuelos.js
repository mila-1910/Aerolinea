document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api";

    const origenInput = document.querySelectorAll(".buscador-campos input[type='text']")[0];
    const destinoInput = document.querySelectorAll(".buscador-campos input[type='text']")[1];
    const fechaIdaInput = document.querySelector(".buscador-campos input[type='date']");
    const fechaRegresoGrupo = document.querySelectorAll(".campo-grupo.fecha")[1];
    const soloIda = document.getElementById("solo-ida");
    const idaVuelta = document.getElementById("ida-vuelta");
    const precioFiltro = document.querySelector(".filtro-grupo input[type='range']");
    const precioTexto = document.querySelector(".precio-rango span:last-child");
    const contador = document.querySelector(".resultados-header p");
    const ordenar = document.querySelector(".ordenar");
    const vuelosGrid = document.querySelector(".vuelos-grid");
    const sinResultados = document.getElementById("sin-resultados-buscar");
    const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");

    let vuelos = [];

    const normalizar = (texto) => {
        return String(texto)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const formatoCOP = (valor) => {
        return "$" + Number(valor).toLocaleString("es-CO") + " COP";
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

    const obtenerSeleccionados = (grupoIndex) => {
        const grupos = document.querySelectorAll(".filtro-grupo");
        const grupo = grupos[grupoIndex];

        if (!grupo) return [];

        return Array.from(grupo.querySelectorAll("input[type='checkbox']:checked"))
            .map(input => normalizar(input.parentElement.textContent));
    };

    const adaptarVueloApi = (vuelo) => {
        return {
            idVuelo: vuelo.id_vuelo,
            numeroVuelo: vuelo.numero_vuelo,
            origen: vuelo.origen,
            destino: vuelo.destino,
            ciudad: vuelo.ciudad_destino,
            fecha: String(vuelo.fecha_salida).split("T")[0],
            fechaTexto: formatoFecha(vuelo.fecha_salida),
            escala: vuelo.escala,
            duracion: formatoDuracion(vuelo.duracion_minutos),
            duracionMinutos: vuelo.duracion_minutos,
            clase: vuelo.clase,
            avion: vuelo.tipo_avion,
            precioNumero: vuelo.precio_base,
            precio: formatoCOP(vuelo.precio_base),
            imagen: vuelo.imagen_url,
            descripcion: vuelo.descripcion,
            ruta: `${vuelo.origen} → ${vuelo.destino}`
        };
    };

    const renderizarVuelos = (listaVuelos) => {
        vuelosGrid.innerHTML = "";

        listaVuelos.forEach((vuelo) => {
            const card = document.createElement("div");
            card.className = "vuelo-card";
            card.dataset.idVuelo = vuelo.idVuelo;
            card.dataset.numeroVuelo = vuelo.numeroVuelo;

            card.innerHTML = `
                <img src="${vuelo.imagen}" alt="${vuelo.ciudad}">
                <div class="vuelo-info">
                    <h4>${vuelo.ruta}</h4>
                    <p><i class="fa-solid fa-plane"></i> ${vuelo.escala} · ${vuelo.duracion}</p>
                    <p><i class="fa-solid fa-calendar-days"></i> ${vuelo.fechaTexto}</p>
                    <div class="vuelo-footer">
                        <span class="vuelo-precio">${vuelo.precio}</span>
                        <a href="detalle-vuelo.html" class="btn-detalle">Ver detalle</a>
                    </div>
                </div>
            `;

            vuelosGrid.appendChild(card);
        });
    };

    const filtrarVuelos = () => {
        const origen = normalizar(origenInput.value);
        const destino = normalizar(destinoInput.value);
        const fecha = fechaIdaInput.value;
        const precioMaximo = Number(precioFiltro.value);

        const escalas = obtenerSeleccionados(1);
        const clases = obtenerSeleccionados(2);
        const aviones = obtenerSeleccionados(3);

        let filtrados = vuelos.filter((vuelo) => {
            const pasaOrigen = origen === "" || normalizar(vuelo.origen).includes(origen);
            const pasaDestino = destino === "" || normalizar(vuelo.destino).includes(destino);
            const pasaFecha = fecha === "" || vuelo.fecha === fecha;
            const pasaPrecio = vuelo.precioNumero <= precioMaximo;

            const pasaEscala = escalas.length === 0 || escalas.some(item => normalizar(vuelo.escala).includes(item.replace("vuelo ", "")));
            const pasaClase = clases.length === 0 || clases.some(item => normalizar(vuelo.clase).includes(item));
            const pasaAvion = aviones.length === 0 || aviones.some(item => normalizar(vuelo.avion).includes(item));

            return pasaOrigen && pasaDestino && pasaFecha && pasaPrecio && pasaEscala && pasaClase && pasaAvion;
        });

        const opcionOrden = normalizar(ordenar.options[ordenar.selectedIndex].textContent);

        if (opcionOrden.includes("menor")) {
            filtrados.sort((a, b) => a.precioNumero - b.precioNumero);
        }

        if (opcionOrden.includes("mayor")) {
            filtrados.sort((a, b) => b.precioNumero - a.precioNumero);
        }

        if (opcionOrden.includes("duracion")) {
            filtrados.sort((a, b) => a.duracionMinutos - b.duracionMinutos);
        }

        renderizarVuelos(filtrados);

        contador.textContent = filtrados.length === 1
            ? "1 vuelo encontrado"
            : `${filtrados.length} vuelos encontrados`;

        if (sinResultados) {
            sinResultados.style.display = filtrados.length === 0 ? "block" : "none";
        }
    };

    const limpiarFiltros = () => {
        // Limpia campos y filtros
        origenInput.value = "";
        destinoInput.value = "";
        fechaIdaInput.value = "";

        idaVuelta.checked = true;
        soloIda.checked = false;
        actualizarTipoViaje();

        precioFiltro.value = "5000000";
        precioTexto.textContent = formatoCOP(precioFiltro.value);

        document.querySelectorAll(".filtro-grupo input[type='checkbox']").forEach((check) => {
            check.checked = true;
        });

        filtrarVuelos();
    };

    const actualizarTipoViaje = () => {
        if (soloIda.checked) {
            fechaRegresoGrupo.style.display = "none";
        } else {
            fechaRegresoGrupo.style.display = "";
        }
    };

    const guardarVueloSeleccionado = (event) => {
        const boton = event.target.closest(".btn-detalle");

        if (!boton) return;

        const card = boton.closest(".vuelo-card");
        const idVuelo = Number(card.dataset.idVuelo);

        const vueloSeleccionado = vuelos.find(vuelo => vuelo.idVuelo === idVuelo);

        if (!vueloSeleccionado) return;

        // Guarda el vuelo para mostrarlo en detalle
        localStorage.setItem("vueloSeleccionado", JSON.stringify(vueloSeleccionado));
    };

    const cargarVuelosDesdeBaseDatos = async () => {
        try {
            const response = await fetch(`${API_URL}/vuelos`);

            if (!response.ok) {
                throw new Error("No se pudieron cargar los vuelos");
            }

            const data = await response.json();

            vuelos = data.map(adaptarVueloApi);

            precioFiltro.min = "0";
            precioFiltro.max = "5000000";
            precioFiltro.step = "100000";
            precioFiltro.value = "5000000";
            precioTexto.textContent = formatoCOP(precioFiltro.value);

            filtrarVuelos();
        } catch (error) {
            console.error("Error cargando vuelos:", error);
            contador.textContent = "No se pudieron cargar los vuelos";
        }
    };

    origenInput.addEventListener("input", filtrarVuelos);
    destinoInput.addEventListener("input", filtrarVuelos);
    fechaIdaInput.addEventListener("change", filtrarVuelos);
    precioFiltro.addEventListener("input", () => {
        precioTexto.textContent = formatoCOP(precioFiltro.value);
        filtrarVuelos();
    });

    ordenar.addEventListener("change", filtrarVuelos);
    soloIda.addEventListener("change", actualizarTipoViaje);
    idaVuelta.addEventListener("change", actualizarTipoViaje);
    vuelosGrid.addEventListener("click", guardarVueloSeleccionado);

    document.querySelectorAll(".filtro-grupo input[type='checkbox']").forEach((check) => {
        check.addEventListener("change", filtrarVuelos);
    });

    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener("click", limpiarFiltros);
    }

    actualizarTipoViaje();
    cargarVuelosDesdeBaseDatos();
});
