document.addEventListener("DOMContentLoaded", () => {
    const origenInput = document.querySelector(".buscador-campos input[type='text']:nth-of-type(1)");
    const destinoInput = document.querySelectorAll(".buscador-campos input[type='text']")[1];
    const fechaIdaInput = document.querySelector(".buscador-campos input[type='date']");
    const fechaRegresoGrupo = document.querySelectorAll(".campo-grupo.fecha")[1];
    const soloIda = document.getElementById("solo-ida");
    const idaVuelta = document.getElementById("ida-vuelta");
    const botonBuscar = document.querySelector(".boton-buscar");
    const precioFiltro = document.querySelector(".filtro-grupo input[type='range']");
    const precioTexto = document.querySelector(".precio-rango span:last-child");
    const contador = document.querySelector(".resultados-header p");
    const ordenar = document.querySelector(".ordenar");
    const vuelosGrid = document.querySelector(".vuelos-grid");
    const vuelos = Array.from(document.querySelectorAll(".vuelo-card"));

    if (!botonBuscar || !vuelosGrid || vuelos.length === 0) return;

    precioFiltro.min = "0";
    precioFiltro.max = "5000000";
    precioFiltro.step = "100000";
    precioFiltro.value = "5000000";
    precioTexto.textContent = "$5.000.000 COP";

    const normalizar = (texto) => {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const obtenerPrecio = (card) => {
        const precio = card.querySelector(".vuelo-precio").textContent;
        return Number(precio.replace(/\D/g, ""));
    };

    const obtenerDuracion = (card) => {
        const texto = normalizar(card.textContent);
        const horas = texto.match(/(\d+)h/);
        const minutos = texto.match(/(\d+)min/);

        return (horas ? Number(horas[1]) * 60 : 0) + (minutos ? Number(minutos[1]) : 0);
    };

    const formatoPrecio = (valor) => {
        return "$" + Number(valor).toLocaleString("es-CO") + " COP";
    };

    const convertirFecha = (fechaInput) => {
        if (!fechaInput) return "";

        const meses = {
            "01": "ene",
            "02": "feb",
            "03": "mar",
            "04": "abr",
            "05": "may",
            "06": "jun",
            "07": "jul",
            "08": "ago",
            "09": "sep",
            "10": "oct",
            "11": "nov",
            "12": "dic"
        };

        const partes = fechaInput.split("-");
        return `${Number(partes[2])} ${meses[partes[1]]} ${partes[0]}`;
    };

    const obtenerEscalasSeleccionadas = () => {
        const checks = document.querySelectorAll(".filtro-grupo:nth-of-type(2) input[type='checkbox']:checked");

        return Array.from(checks).map((check) => {
            return normalizar(check.parentElement.textContent);
        });
    };

    const coincideEscala = (card, escalasSeleccionadas) => {
        const texto = normalizar(card.textContent);

        if (escalasSeleccionadas.length === 0) return false;

        if (texto.includes("directo") && escalasSeleccionadas.some(e => e.includes("directo"))) {
            return true;
        }

        if (texto.includes("una escala") && escalasSeleccionadas.some(e => e.includes("una escala"))) {
            return true;
        }

        if ((texto.includes("dos") || texto.includes("mas")) && escalasSeleccionadas.some(e => e.includes("dos"))) {
            return true;
        }

        return false;
    };

    const filtrarVuelos = () => {
        const origen = normalizar(origenInput.value);
        const destino = normalizar(destinoInput.value);
        const fechaBuscada = convertirFecha(fechaIdaInput.value);
        const precioMaximo = Number(precioFiltro.value);
        const escalasSeleccionadas = obtenerEscalasSeleccionadas();

        let visibles = [];

        vuelos.forEach((card) => {
            const texto = normalizar(card.textContent);
            const precio = obtenerPrecio(card);

            const pasaOrigen = origen === "" || texto.includes(origen);
            const pasaDestino = destino === "" || texto.includes(destino);
            const pasaFecha = fechaBuscada === "" || texto.includes(fechaBuscada);
            const pasaPrecio = precio <= precioMaximo;
            const pasaEscala = coincideEscala(card, escalasSeleccionadas);

            const mostrar = pasaOrigen && pasaDestino && pasaFecha && pasaPrecio && pasaEscala;

            card.style.display = mostrar ? "" : "none";

            if (mostrar) {
                visibles.push(card);
            }
        });

        ordenarVuelos(visibles);

        contador.textContent = visibles.length === 1
            ? "1 vuelo encontrado"
            : visibles.length + " vuelos encontrados";
    };

    const ordenarVuelos = (visibles) => {
        const opcion = ordenar.value;

        visibles.sort((a, b) => {
            if (opcion === "Menor a mayor precio") {
                return obtenerPrecio(a) - obtenerPrecio(b);
            }

            if (opcion === "Mayor a menor precio") {
                return obtenerPrecio(b) - obtenerPrecio(a);
            }

            if (opcion === "Mejor calificados") {
                return obtenerDuracion(a) - obtenerDuracion(b);
            }

            return 0;
        });

        visibles.forEach(card => vuelosGrid.appendChild(card));
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

        const vueloSeleccionado = {
            ruta: card.querySelector("h4").textContent,
            precio: card.querySelector(".vuelo-precio").textContent,
            imagen: card.querySelector("img").getAttribute("src"),
            informacion: card.querySelectorAll("p")[0].textContent,
            fecha: card.querySelectorAll("p")[1].textContent
        };

        localStorage.setItem("vueloSeleccionado", JSON.stringify(vueloSeleccionado));
    };

    botonBuscar.addEventListener("click", filtrarVuelos);
    precioFiltro.addEventListener("input", () => {
        precioTexto.textContent = formatoPrecio(precioFiltro.value);
        filtrarVuelos();
    });

    ordenar.addEventListener("change", filtrarVuelos);
    soloIda.addEventListener("change", actualizarTipoViaje);
    idaVuelta.addEventListener("change", actualizarTipoViaje);
    vuelosGrid.addEventListener("click", guardarVueloSeleccionado);

    document.querySelectorAll(".filtro-grupo input[type='checkbox']").forEach((check) => {
        check.addEventListener("change", filtrarVuelos);
    });

    actualizarTipoViaje();
    contador.textContent = vuelos.length + " vuelos encontrados";
});
