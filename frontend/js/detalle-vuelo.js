document.addEventListener("DOMContentLoaded", () => {
    const vuelosDisponibles = [
        {
            numeroVuelo: "EL-204",
            origen: "Bogotá",
            destino: "Nueva York",
            ciudad: "Nueva York",
            fecha: "2026-04-15",
            fechaTexto: "15 Abr 2026",
            escala: "Directo",
            duracion: "6h 30min",
            clase: "Económica",
            avion: "Boeing",
            ruta: "Bogotá → Nueva York",
            precio: "$3.290.000 COP",
            imagen: "../../imagenes/nueva-york.jpg"
        },
        {
            numeroVuelo: "EL-422",
            origen: "Bogotá",
            destino: "París",
            ciudad: "París",
            fecha: "2026-05-22",
            fechaTexto: "22 May 2026",
            escala: "Una escala",
            duracion: "12h 45min",
            clase: "Económica",
            avion: "Airbus",
            ruta: "Bogotá → París",
            precio: "$4.480.000 COP",
            imagen: "../../imagenes/paris.jpg"
        },
        {
            numeroVuelo: "EL-310",
            origen: "Medellín",
            destino: "Cancún",
            ciudad: "Cancún",
            fecha: "2026-06-10",
            fechaTexto: "10 Jun 2026",
            escala: "Directo",
            duracion: "4h 15min",
            clase: "Ejecutiva",
            avion: "Boeing",
            ruta: "Medellín → Cancún",
            precio: "$2.170.000 COP",
            imagen: "../../imagenes/cancun.jpg"
        },
        {
            numeroVuelo: "EL-105",
            origen: "Cali",
            destino: "Madrid",
            ciudad: "Madrid",
            fecha: "2026-07-05",
            fechaTexto: "5 Jul 2026",
            escala: "Una escala",
            duracion: "14h 20min",
            clase: "Primera clase",
            avion: "Airbus",
            ruta: "Cali → Madrid",
            precio: "$3.890.000 COP",
            imagen: "../../imagenes/madrid.jpg"
        },
        {
            numeroVuelo: "EL-518",
            origen: "Bogotá",
            destino: "Buenos Aires",
            ciudad: "Buenos Aires",
            fecha: "2026-08-18",
            fechaTexto: "18 Ago 2026",
            escala: "Directo",
            duracion: "6h 10min",
            clase: "Económica",
            avion: "Boeing",
            ruta: "Bogotá → Buenos Aires",
            precio: "$2.760.000 COP",
            imagen: "../../imagenes/buenos-aires.jpg"
        },
        {
            numeroVuelo: "EL-267",
            origen: "Cartagena",
            destino: "Ciudad de México",
            ciudad: "Ciudad de México",
            fecha: "2026-09-02",
            fechaTexto: "2 Sep 2026",
            escala: "Una escala",
            duracion: "5h 55min",
            clase: "Ejecutiva",
            avion: "Airbus",
            ruta: "Cartagena → Ciudad de México",
            precio: "$2.340.000 COP",
            imagen: "../../imagenes/ciudad-mexico.jpg"
        }
    ];

    const descripciones = {
        "Nueva York": "Disfruta de un increíble viaje a Nueva York, una de las ciudades más icónicas del mundo. Recorre sus rascacielos, visita Central Park y vive la energía única de Times Square.",
        "París": "Viaja a París y descubre una ciudad llena de historia, arte y elegancia. Recorre sus calles, visita la Torre Eiffel y disfruta una experiencia inolvidable.",
        "Cancún": "Escápate a Cancún y disfruta playas de arena blanca, aguas cristalinas y un ambiente perfecto para descansar o vivir nuevas aventuras.",
        "Madrid": "Conoce Madrid, una ciudad vibrante con gran riqueza cultural, gastronomía única y lugares históricos que hacen de cada recorrido una experiencia especial.",
        "Buenos Aires": "Descubre Buenos Aires, una ciudad llena de cultura, música y arquitectura. Disfruta sus barrios tradicionales, su gastronomía y su ambiente urbano.",
        "Ciudad de México": "Explora Ciudad de México, un destino lleno de historia, sabores y lugares emblemáticos. Vive una experiencia cultural completa desde el primer día."
    };

    const imagen = document.getElementById("detalle-imagen-vuelo");
    const ciudad = document.getElementById("detalle-ciudad");
    const precio = document.getElementById("detalle-precio");
    const tipo = document.getElementById("detalle-tipo");
    const numero = document.getElementById("detalle-numero");
    const ruta = document.getElementById("detalle-ruta");
    const duracion = document.getElementById("detalle-duracion");
    const escala = document.getElementById("detalle-escala");
    const origenSelect = document.getElementById("detalle-origen-select");
    const fechaSelect = document.getElementById("detalle-fecha-select");
    const btnReservar = document.getElementById("btn-reservar-vuelo");

    const descripcionToggle = document.getElementById("descripcion-toggle");
    const descripcionTexto = document.getElementById("descripcion-texto");
    const descripcionIcono = document.getElementById("descripcion-icono");
    const relacionadosGrid = document.getElementById("destinos-relacionados-grid");

    const vueloGuardado = localStorage.getItem("vueloSeleccionado");
    let vuelo = vueloGuardado ? JSON.parse(vueloGuardado) : vuelosDisponibles[0];

    const obtenerPrecioNumero = (precioTexto) => {
        return Number(precioTexto.replace(/\D/g, ""));
    };

    const cargarDetalle = () => {
        // Datos principales del vuelo
        imagen.src = vuelo.imagen;
        imagen.alt = vuelo.ciudad;
        ciudad.textContent = vuelo.ciudad;
        precio.textContent = vuelo.precio;
        tipo.textContent = "Vuelo ida y vuelta";
        numero.textContent = vuelo.numeroVuelo;
        ruta.textContent = `${vuelo.origen} → ${vuelo.destino}`;
        duracion.textContent = vuelo.duracion;
        escala.textContent = vuelo.escala;

        descripcionTexto.textContent = descripciones[vuelo.ciudad] || descripciones["Nueva York"];
    };

    const cargarSelects = () => {
        // Opciones simples para el usuario
        const origenes = ["Bogotá", "Medellín", "Cali", "Cartagena"];
        const fechas = [vuelo.fechaTexto, "21 May 2026", "10 Jun 2026", "18 Ago 2026"];

        origenSelect.innerHTML = "";
        fechaSelect.innerHTML = "";

        origenes.forEach((origen) => {
            const option = document.createElement("option");
            option.textContent = origen;
            option.selected = origen === vuelo.origen;
            origenSelect.appendChild(option);
        });

        fechas.forEach((fecha) => {
            const option = document.createElement("option");
            option.textContent = fecha;
            option.selected = fecha === vuelo.fechaTexto;
            fechaSelect.appendChild(option);
        });
    };

    const cargarRelacionados = () => {
        // Destinos relacionados
        const relacionados = vuelosDisponibles
            .filter(item => item.ciudad !== vuelo.ciudad)
            .slice(0, 2);

        relacionadosGrid.innerHTML = "";

        relacionados.forEach((item) => {
            const card = document.createElement("div");
            card.className = "relacionado-card";

            card.innerHTML = `
                <img src="${item.imagen}" alt="${item.ciudad}">
                <div class="relacionado-overlay">
                    <span>${item.ciudad}</span>
                </div>
            `;

            card.addEventListener("click", () => {
                localStorage.setItem("vueloSeleccionado", JSON.stringify(item));
                window.location.href = "detalle-vuelo.html";
            });

            relacionadosGrid.appendChild(card);
        });
    };

    descripcionToggle.addEventListener("click", () => {
        // Abre y cierra descripción
        descripcionTexto.classList.toggle("oculta");

        descripcionIcono.textContent = descripcionTexto.classList.contains("oculta")
            ? "▼"
            : "▲";
    });

    origenSelect.addEventListener("change", () => {
        // Actualiza origen elegido
        vuelo.origen = origenSelect.value;
        vuelo.ruta = `${vuelo.origen} → ${vuelo.destino}`;
        ruta.textContent = vuelo.ruta;
    });

    fechaSelect.addEventListener("change", () => {
        // Actualiza fecha elegida
        vuelo.fechaTexto = fechaSelect.value;
    });

    btnReservar.addEventListener("click", () => {
        vuelo.origen = origenSelect.value;
        vuelo.fechaTexto = fechaSelect.value;
        vuelo.ruta = `${vuelo.origen} → ${vuelo.destino}`;

        // Reserva para el resumen
        const reservaEnProceso = {
            numeroReserva: "RES-" + Date.now().toString().slice(-4),
            estado: "Pendiente",
            fechaReserva: new Date().toLocaleDateString("es-CO"),
            pasajeros: 1,
            clase: vuelo.clase,
            totalTexto: vuelo.precio,
            totalNumero: obtenerPrecioNumero(vuelo.precio),
            vuelo: vuelo
        };

        localStorage.setItem("reservaEnProceso", JSON.stringify(reservaEnProceso));
    });

    cargarDetalle();
    cargarSelects();
    cargarRelacionados();
});