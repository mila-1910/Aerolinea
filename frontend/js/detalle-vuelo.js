document.addEventListener("DOMContentLoaded", () => {
    const vuelosDisponibles = [
        {
            idVuelo: 1,
            numeroVuelo: "EL-204",
            origen: "Bogotá",
            destino: "Nueva York",
            ciudad: "Nueva York",
            fecha: "2026-04-15",
            fechaTexto: "15 Abr 2026",
            escala: "Directo",
            duracion: "6h 30min",
            duracionMinutos: 390,
            clase: "Económica",
            avion: "Boeing",
            ruta: "Bogotá → Nueva York",
            precioNumero: 3290000,
            precio: "$3.290.000 COP",
            imagen: "../../imagenes/nueva-york.jpg",
            descripcion: "Disfruta de un increíble viaje a Nueva York, una de las ciudades más icónicas del mundo."
        }
    ];

    const loaderVuelo = document.getElementById("loader-vuelo");
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

    const obtenerUsuario = () => {
        // Usuario que inició sesión
        const usuarioRaw = localStorage.getItem("usuario");

        if (!usuarioRaw) return null;

        return JSON.parse(usuarioRaw);
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
        descripcionTexto.textContent = vuelo.descripcion;
                // Oculta el mensaje de carga
        if (loaderVuelo) {
            loaderVuelo.style.display = "none";
        }

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

    const mostrarAvisoReserva = () => {
        // Aviso antes de ir al resumen
        const aviso = document.createElement("div");
        aviso.className = "aviso-reserva";
        aviso.textContent = "Reserva preparada. Te llevamos al resumen...";

        document.body.appendChild(aviso);

        setTimeout(() => {
            aviso.classList.add("activo");
        }, 50);
    };

    const cargarRelacionados = () => {
        // Relacionados temporales usando datos ya guardados
        const relacionadosBase = [
    {
        idVuelo: 1,
        ciudad: "Nueva York",
        imagen: "../../imagenes/nueva-york.jpg",
        ruta: "Bogotá → Nueva York",
        numeroVuelo: "EL-204",
        origen: "Bogotá",
        destino: "Nueva York",
        fechaTexto: "15 Abr 2026",
        fecha: "2026-04-15",
        escala: "Directo",
        duracion: "6h 30min",
        clase: "Económica",
        avion: "Boeing",
        precio: "$3.290.000 COP",
        precioNumero: 3290000,
        descripcion: "Disfruta de un increíble viaje a Nueva York, una de las ciudades más icónicas del mundo."
    },
    {
        idVuelo: 2,
        ciudad: "París",
        imagen: "../../imagenes/paris.jpg",
        ruta: "Bogotá → París",
        numeroVuelo: "EL-422",
        origen: "Bogotá",
        destino: "París",
        fechaTexto: "22 May 2026",
        fecha: "2026-05-22",
        escala: "Una escala",
        duracion: "12h 45min",
        clase: "Económica",
        avion: "Airbus",
        precio: "$4.480.000 COP",
        precioNumero: 4480000,
        descripcion: "Viaja a París y descubre una ciudad llena de historia, arte y elegancia."
    },
    {
        idVuelo: 3,
        ciudad: "Cancún",
        imagen: "../../imagenes/cancun.jpg",
        ruta: "Medellín → Cancún",
        numeroVuelo: "EL-310",
        origen: "Medellín",
        destino: "Cancún",
        fechaTexto: "10 Jun 2026",
        fecha: "2026-06-10",
        escala: "Directo",
        duracion: "4h 15min",
        clase: "Ejecutiva",
        avion: "Boeing",
        precio: "$2.170.000 COP",
        precioNumero: 2170000,
        descripcion: "Escápate a Cancún y disfruta playas de arena blanca y aguas cristalinas."
    },
    {
        idVuelo: 4,
        ciudad: "Madrid",
        imagen: "../../imagenes/madrid.jpg",
        ruta: "Cali → Madrid",
        numeroVuelo: "EL-105",
        origen: "Cali",
        destino: "Madrid",
        fechaTexto: "5 Jul 2026",
        fecha: "2026-07-05",
        escala: "Una escala",
        duracion: "14h 20min",
        clase: "Primera clase",
        avion: "Airbus",
        precio: "$3.890.000 COP",
        precioNumero: 3890000,
        descripcion: "Conoce Madrid, una ciudad vibrante con gran riqueza cultural y gastronómica."
    },
    {
        idVuelo: 5,
        ciudad: "Buenos Aires",
        imagen: "../../imagenes/buenos-aires.jpg",
        ruta: "Bogotá → Buenos Aires",
        numeroVuelo: "EL-518",
        origen: "Bogotá",
        destino: "Buenos Aires",
        fechaTexto: "18 Ago 2026",
        fecha: "2026-08-18",
        escala: "Directo",
        duracion: "6h 10min",
        clase: "Económica",
        avion: "Boeing",
        precio: "$2.760.000 COP",
        precioNumero: 2760000,
        descripcion: "Descubre Buenos Aires, una ciudad llena de cultura, música y arquitectura."
    },
    {
        idVuelo: 6,
        ciudad: "Ciudad de México",
        imagen: "../../imagenes/ciudad-mexico.jpg",
        ruta: "Cartagena → Ciudad de México",
        numeroVuelo: "EL-267",
        origen: "Cartagena",
        destino: "Ciudad de México",
        fechaTexto: "2 Sep 2026",
        fecha: "2026-09-02",
        escala: "Una escala",
        duracion: "5h 55min",
        clase: "Ejecutiva",
        avion: "Airbus",
        precio: "$2.340.000 COP",
        precioNumero: 2340000,
        descripcion: "Explora Ciudad de México, un destino lleno de historia, sabores y lugares emblemáticos."
    }
];


        const relacionados = relacionadosBase
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

    btnReservar.addEventListener("click", (event) => {
        event.preventDefault();

        const usuario = obtenerUsuario();

        if (!usuario) {
            alert("Debes iniciar sesión para reservar.");
            window.location.href = "../inicio/login.html";
            return;
        }

        vuelo.origen = origenSelect.value;
        vuelo.fechaTexto = fechaSelect.value;
        vuelo.ruta = `${vuelo.origen} → ${vuelo.destino}`;

        // Reserva lista para enviar luego a la base de datos
        const reservaEnProceso = {
            numeroReserva: "RES-" + Date.now().toString().slice(-4),
            idUsuario: usuario.id,
            idVuelo: vuelo.idVuelo,
            estado: "Pendiente",
            fechaReserva: new Date().toLocaleDateString("es-CO"),
            pasajeros: 1,
            clase: vuelo.clase,
            totalTexto: vuelo.precio,
            totalNumero: vuelo.precioNumero,
            vuelo: vuelo
        };

        localStorage.setItem("reservaEnProceso", JSON.stringify(reservaEnProceso));
        mostrarAvisoReserva();

        setTimeout(() => {
            window.location.href = "resumen-reserva.html";
        }, 900);
    });

    cargarDetalle();
    cargarSelects();
    cargarRelacionados();
});
