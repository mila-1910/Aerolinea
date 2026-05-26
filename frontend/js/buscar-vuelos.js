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
    const contador = document.getElementById("contador-vuelos");
    const ordenar = document.querySelector(".ordenar");
    const vuelosGrid = document.querySelector(".vuelos-grid");
    const sinResultados = document.getElementById("sin-resultados-buscar");
    const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");
    const destinosDisponibles = document.getElementById("destinos-disponibles");
    const paquetesDestacados = document.getElementById("paquetes-destacados");

    let vuelos = [];
    let ubicaciones = [];
    let paquetes = [];

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
            precioNumero: Number(vuelo.precio_base),
            precio: formatoCOP(vuelo.precio_base),
            imagen: vuelo.imagen_url || "../../imagenes/nueva-york-hero.jpg",
            descripcion: vuelo.descripcion,
            ruta: `${vuelo.origen} → ${vuelo.destino}`
        };
    };

    const getImagenUrl = (destino) => {
        if (!destino) return '../../imagenes/nueva-york-hero.jpg';
        const d = String(destino).toLowerCase();
        if (d.includes('buenos aires')) return '../../imagenes/buenos-aires.jpg';
        if (d.includes('cancun') || d.includes('cancún')) return '../../imagenes/cancun.jpg';
        if (d.includes('mexico') || d.includes('méxico')) return '../../imagenes/ciudad-mexico.jpg';
        if (d.includes('madrid')) return '../../imagenes/madrid.jpg';
        if (d.includes('york')) return '../../imagenes/nueva-york.jpg';
        if (d.includes('paris') || d.includes('parís')) return '../../imagenes/paris.jpg';
        return '../../imagenes/nueva-york-hero.jpg';
    };

    const renderizarVuelos = (itemsCombinados) => {
        vuelosGrid.innerHTML = "";

        itemsCombinados.forEach((item, index) => {
            const card = document.createElement("div");
            
            if (item.tipo === 'paquete') {
                const paquete = item.datos;
                card.className = "vuelo-card paquete-card reveal";
                card.dataset.idPaquete = paquete.id_paquete;
                card.setAttribute("role", "article");
                card.setAttribute("aria-label", `Paquete turístico a ${paquete.destino || paquete.sector_destino}`);
                card.style.viewTransitionName = `card-paquete-${paquete.id_paquete}`;

                if (!document.startViewTransition) {
                    card.classList.add("animar-entrada");
                    card.style.animationDelay = `${(index % 15) * 50}ms`;
                }

                card.innerHTML = `
                    <img src="${item.imagen}" alt="Vista de ${paquete.destino || paquete.sector_destino}" class="vuelo-card-bg">
                    <div class="vuelo-card-overlay"></div>
                    <div class="vuelo-card-content">
                        <div class="vuelo-card-info-row">
                            <div class="vuelo-card-info">
                                <span class="badge-premium" style="background: linear-gradient(135deg, #d4af37, #aa7c11); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 8px;"><i class="fa-solid fa-gift"></i> PAQUETE TURÍSTICO</span>
                                <h4>${paquete.nombre}</h4>
                                <p><i class="fa-solid fa-map-marker-alt card-icon"></i> Destino: ${paquete.destino || paquete.sector_destino}</p>
                                <p><i class="fa-solid fa-clock card-icon"></i> Duración: ${paquete.duracion} días</p>
                            </div>
                            <div class="vuelo-card-price">
                                <span>Desde</span>
                                <strong>$${Number(paquete.precio).toLocaleString('es-CO')} COP</strong>
                            </div>
                        </div>
                    </div>
                    <div class="vuelo-card-hover-actions">
                        <a href="#" class="btn-reservar" onclick="alert('¡Reserva de paquete iniciada para ${paquete.nombre}!'); return false;">Reservar paquete</a>
                    </div>
                `;
            } else {
                const vuelo = item.datos;
                card.className = "vuelo-card reveal";
                card.dataset.idVuelo = vuelo.idVuelo;
                card.dataset.numeroVuelo = vuelo.numeroVuelo;
                card.setAttribute("role", "article");
                card.setAttribute("aria-label", `Vuelo de ${vuelo.origen} a ${vuelo.destino}`);
                
                card.style.viewTransitionName = `card-vuelo-${vuelo.idVuelo}`;
                
                if (!document.startViewTransition) {
                    card.classList.add("animar-entrada");
                    card.style.animationDelay = `${(index % 15) * 50}ms`;
                }

                card.innerHTML = `
                    <img src="${vuelo.imagen}" alt="Vista representativa de ${vuelo.ciudad}" class="vuelo-card-bg">
                    <div class="vuelo-card-overlay"></div>
                    <div class="vuelo-card-content">
                        <div class="vuelo-card-info-row">
                            <div class="vuelo-card-info">
                                <h4>${vuelo.ruta}</h4>
                                <p><i class="fa-solid fa-plane card-icon"></i> ${vuelo.escala} · ${vuelo.duracion}</p>
                                <p><i class="fa-solid fa-calendar-days card-icon"></i> ${vuelo.fechaTexto}</p>
                            </div>
                            <div class="vuelo-card-price">
                                <span>Desde</span>
                                <strong>${vuelo.precio}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="vuelo-card-hover-actions">
                        <a href="detalle-vuelo.html?id=${vuelo.numeroVuelo}" class="btn-reservar">Reservar vuelo</a>
                    </div>
                `;
            }

            vuelosGrid.appendChild(card);
        });

        // Observar tarjetas dinámicas con IntersectionObserver para activar la animación de entrada
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            });

            vuelosGrid.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        } else {
            // Fallback si no está soportado: hacer visibles inmediatamente
            vuelosGrid.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
        }
    };

    const renderizarDestinosDisponibles = () => {
        if (!destinosDisponibles) {
            return;
        }

        if (!ubicaciones.length) {
            destinosDisponibles.innerHTML = '<p class="info-vacia">No hay destinos disponibles todavía.</p>';
            return;
        }

        destinosDisponibles.innerHTML = ubicaciones
            .slice(0, 6)
            .map((ubicacion) => `
                <article class="destino-chip">
                    <strong>${ubicacion.ciudad || 'Destino'}</strong>
                    <span>${ubicacion.pais || '—'}</span>
                    <small>${ubicacion.codigo_aeropuerto || '—'}</small>
                </article>
            `)
            .join('');
    };

    const renderizarPaquetes = () => {
        if (!paquetesDestacados) {
            return;
        }

        const activos = paquetes.filter((paquete) => paquete.estado === 'Activo' || !paquete.estado);

        if (!activos.length) {
            paquetesDestacados.innerHTML = '<p class="info-vacia">Aún no hay paquetes turísticos activos.</p>';
            return;
        }

        paquetesDestacados.innerHTML = activos
            .slice(0, 4)
            .map((paquete) => `
                <article class="paquete-mini">
                    <div>
                        <strong>${paquete.nombre || 'Paquete sin nombre'}</strong>
                        <p>${paquete.destino || paquete.sector_destino || 'Destino por confirmar'}</p>
                    </div>
                    <span>$${Number(paquete.precio || 0).toLocaleString('es-CO')}</span>
                </article>
            `)
            .join('');
    };

    const actualizarFiltrosYDestinos = () => {
        if (!ubicaciones.length) return;

        // Ciudades de origen activas (ciudades que tienen al menos un vuelo programado desde allí)
        const ciudadesOrigenActivas = new Set(vuelos.map(v => v.origen).filter(Boolean));

        // Ciudades de destino activas (ciudades que tienen al menos un vuelo programado hacia allí,
        // o que tienen al menos un paquete turístico activo)
        const ciudadesDestinoConVuelo = vuelos.map(v => v.destino).filter(Boolean);
        const ciudadesDestinoConPaquete = paquetes
            .filter(p => p.estado === 'Activo' || !p.estado)
            .map(p => p.destino || p.sector_destino)
            .filter(Boolean);
        
        const ciudadesDestinoActivas = new Set([
            ...ciudadesDestinoConVuelo,
            ...ciudadesDestinoConPaquete
        ]);

        // Filtrar ubicaciones para el listado de destinos disponibles
        // Solo mostrar ubicaciones que son un destino activo
        const ubicacionesFiltradas = ubicaciones.filter(u => {
            const ciudadNorm = normalizar(u.ciudad);
            return Array.from(ciudadesDestinoActivas).some(c => normalizar(c) === ciudadNorm);
        });

        // Actualizar datalist de origen (solo ciudades de origen con vuelos)
        const listaOrigen = document.getElementById('lista-origen');
        if (listaOrigen) {
            const opcionesOrigen = Array.from(new Set(ubicaciones
                .filter(u => Array.from(ciudadesOrigenActivas).some(c => normalizar(c) === normalizar(u.ciudad)))
                .map(u => u.ciudad)
            ));
            listaOrigen.innerHTML = opcionesOrigen.map(ciudad => `<option value="${ciudad}"></option>`).join('');
        }

        // Actualizar datalist de destino (solo ciudades de destino con vuelos o paquetes)
        const listaDestino = document.getElementById('lista-destino');
        if (listaDestino) {
            const opcionesDestino = Array.from(new Set(ubicaciones
                .filter(u => Array.from(ciudadesDestinoActivas).some(c => normalizar(c) === normalizar(u.ciudad)))
                .map(u => u.ciudad)
            ));
            listaDestino.innerHTML = opcionesDestino.map(ciudad => `<option value="${ciudad}"></option>`).join('');
        }

        // Renderizar destinos disponibles con las ubicaciones filtradas
        if (destinosDisponibles) {
            if (!ubicacionesFiltradas.length) {
                destinosDisponibles.innerHTML = '<p class="info-vacia">No hay destinos disponibles todavía.</p>';
            } else {
                destinosDisponibles.innerHTML = ubicacionesFiltradas
                    .slice(0, 6)
                    .map((ubicacion) => `
                        <article class="destino-chip">
                            <strong>${ubicacion.ciudad || 'Destino'}</strong>
                            <span>${ubicacion.pais || '—'}</span>
                            <small>${ubicacion.codigo_aeropuerto || '—'}</small>
                        </article>
                    `)
                    .join('');
            }
        }
    };

    const cargarUbicacionesDisponibles = async () => {
        try {
            const response = await fetch(`${API_URL}/ubicaciones`);

            if (!response.ok) {
                throw new Error('No se pudieron cargar las ubicaciones');
            }

            ubicaciones = await response.json();
            const opciones = Array.from(new Set(ubicaciones.map((ubicacion) => ubicacion.ciudad).filter(Boolean)));

            if (origenInput) {
                origenInput.setAttribute('list', 'lista-origen');
            }

            if (destinoInput) {
                destinoInput.setAttribute('list', 'lista-destino');
            }

            const listaOrigen = document.getElementById('lista-origen');
            const listaDestino = document.getElementById('lista-destino');

            if (listaOrigen) {
                listaOrigen.innerHTML = opciones.map((ciudad) => `<option value="${ciudad}"></option>`).join('');
            }

            if (listaDestino) {
                listaDestino.innerHTML = opciones.map((ciudad) => `<option value="${ciudad}"></option>`).join('');
            }

            renderizarDestinosDisponibles();
            actualizarFiltrosYDestinos();
        } catch (error) {
            console.error('Error cargando ubicaciones para el cliente:', error);
        }
    };

    const cargarPaquetesDestacados = async () => {
        try {
            const response = await fetch(`${API_URL}/paquetes`);

            if (!response.ok) {
                throw new Error('No se pudieron cargar los paquetes');
            }

            const data = await response.json();
            paquetes = Array.isArray(data) ? data : data.value || [];
            renderizarPaquetes();
            actualizarFiltrosYDestinos();
        } catch (error) {
            console.error('Error cargando paquetes para el cliente:', error);
            renderizarPaquetes();
        }
    };

    const filtrarVuelos = () => {
        const origen = normalizar(origenInput.value);
        const destino = normalizar(destinoInput.value);
        const fecha = fechaIdaInput.value;
        const precioMaximo = Number(precioFiltro.value);

        const escalas = obtenerSeleccionados(1);
        const clases = obtenerSeleccionados(2);
        const aviones = obtenerSeleccionados(3);

        // 1. Filtrar vuelos
        let vuelosFiltrados = vuelos.filter((vuelo) => {
            const pasaOrigen = origen === "" || normalizar(vuelo.origen).includes(origen);
            const pasaDestino = destino === "" || normalizar(vuelo.destino).includes(destino);
            const pasaFecha = fecha === "" || vuelo.fecha === fecha;
            const pasaPrecio = vuelo.precioNumero <= precioMaximo;

            const pasaEscala = escalas.length === 0 || escalas.some(item => normalizar(vuelo.escala).includes(item.replace("vuelo ", "")));
            const pasaClase = clases.length === 0 || clases.some(item => normalizar(vuelo.clase).includes(item));
            const pasaAvion = aviones.length === 0 || aviones.some(item => normalizar(vuelo.avion).includes(item));

            return pasaOrigen && pasaDestino && pasaFecha && pasaPrecio && pasaEscala && pasaClase && pasaAvion;
        });

        // 2. Filtrar paquetes
        let paquetesFiltrados = paquetes.filter((paquete) => {
            const activo = paquete.estado === 'Activo' || !paquete.estado;
            if (!activo) return false;

            const nombreDest = paquete.destino || paquete.sector_destino || '';
            const pasaDestino = destino === "" || normalizar(nombreDest).includes(destino);
            const pasaPrecio = Number(paquete.precio) <= precioMaximo;

            return pasaDestino && pasaPrecio;
        });

        // 3. Mapear a una estructura uniforme
        const vuelosMapeados = vuelosFiltrados.map(v => ({
            tipo: 'vuelo',
            idVuelo: v.idVuelo,
            numeroVuelo: v.numeroVuelo,
            origen: v.origen,
            destino: v.destino,
            precioNumero: v.precioNumero,
            duracionMinutos: v.duracionMinutos,
            imagen: v.imagen,
            datos: v
        }));

        const paquetesMapeados = paquetesFiltrados.map(p => ({
            tipo: 'paquete',
            id: p.id_paquete,
            precioNumero: Number(p.precio || 0),
            duracionMinutos: 999999, // Valor alto para ordenar por duración (vuelos primero)
            imagen: getImagenUrl(p.destino || p.sector_destino),
            datos: p
        }));

        // Combinar
        const itemsCombinados = [...vuelosMapeados, ...paquetesMapeados];

        // 4. Ordenar
        const opcionOrden = normalizar(ordenar.options[ordenar.selectedIndex].textContent);

        if (opcionOrden.includes("menor")) {
            itemsCombinados.sort((a, b) => a.precioNumero - b.precioNumero);
        } else if (opcionOrden.includes("mayor")) {
            itemsCombinados.sort((a, b) => b.precioNumero - a.precioNumero);
        } else if (opcionOrden.includes("duracion")) {
            itemsCombinados.sort((a, b) => a.duracionMinutos - b.duracionMinutos);
        } else {
            // Orden por defecto: vuelos primero, luego paquetes
            itemsCombinados.sort((a, b) => {
                if (a.tipo === b.tipo) return 0;
                return a.tipo === 'vuelo' ? -1 : 1;
            });
        }

        const actualizarDOM = () => {
            renderizarVuelos(itemsCombinados);

            const totalVuelos = vuelosMapeados.length;
            const totalPaquetes = paquetesMapeados.length;

            let textoContador = "";
            if (totalVuelos > 0 && totalPaquetes > 0) {
                textoContador = `${totalVuelos} vuelos y ${totalPaquetes} paquetes encontrados`;
            } else if (totalVuelos > 0) {
                textoContador = totalVuelos === 1 ? "1 vuelo encontrado" : `${totalVuelos} vuelos encontrados`;
            } else if (totalPaquetes > 0) {
                textoContador = totalPaquetes === 1 ? "1 paquete encontrado" : `${totalPaquetes} paquetes encontrados`;
            } else {
                textoContador = "No se encontraron resultados";
            }
            contador.textContent = textoContador;

            if (sinResultados) {
                sinResultados.style.display = itemsCombinados.length === 0 ? "block" : "none";
            }
        };

        if (document.startViewTransition) {
            document.startViewTransition(() => actualizarDOM());
        } else {
            actualizarDOM();
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
            check.checked = false;
        });

        filtrarVuelos();
    };

    const actualizarTipoViaje = () => {
        if (soloIda.checked) {
            fechaRegresoGrupo.classList.add("oculto");
        } else {
            fechaRegresoGrupo.classList.remove("oculto");
        }
    };

    const guardarVueloSeleccionado = (event) => {
        const boton = event.target.closest(".btn-ver-detalle") || event.target.closest(".btn-reservar");

        if (!boton) return;

        const card = boton.closest(".vuelo-card");
        const idVuelo = String(card.dataset.idVuelo || '');

        const vueloSeleccionado = vuelos.find(vuelo => String(vuelo.idVuelo) === idVuelo);

        if (!vueloSeleccionado) return;

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
            actualizarFiltrosYDestinos();
        } catch (error) {
            console.error("Error cargando vuelos:", error);
            contador.textContent = "No se pudieron cargar los vuelos";
        }
    };

    let debounceTimer;
    const filtrarVuelosDebounced = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filtrarVuelos();
        }, 150);
    };

    origenInput.addEventListener("input", filtrarVuelosDebounced);
    destinoInput.addEventListener("input", filtrarVuelosDebounced);
    fechaIdaInput.addEventListener("change", filtrarVuelos);
    precioFiltro.addEventListener("input", () => {
        precioTexto.textContent = formatoCOP(precioFiltro.value);
        filtrarVuelosDebounced();
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

    const leerParametrosURL = () => {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('origen')) origenInput.value = params.get('origen');
        if (params.has('destino')) destinoInput.value = params.get('destino');
        if (params.has('ida')) fechaIdaInput.value = params.get('ida');
        
        const fechaRegresoInput = fechaRegresoGrupo.querySelector("input[type='date']");
        if (params.has('regreso') && fechaRegresoInput) {
            fechaRegresoInput.value = params.get('regreso');
        }
        
        const pasajerosInput = document.getElementById("pasajeros");
        if (params.has('pasajeros') && pasajerosInput) {
            pasajerosInput.value = params.get('pasajeros');
        }

        if (params.has('tipo')) {
            if (params.get('tipo') === 'solo-ida') {
                soloIda.checked = true;
                idaVuelta.checked = false;
            } else {
                soloIda.checked = false;
                idaVuelta.checked = true;
            }
        }
    };

    const iniciarCarruselHero = () => {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Cambia cada 5 segundos
    };

    leerParametrosURL();
    actualizarTipoViaje();
    cargarUbicacionesDisponibles();
    cargarPaquetesDestacados();
    cargarVuelosDesdeBaseDatos();
    iniciarCarruselHero();
});
