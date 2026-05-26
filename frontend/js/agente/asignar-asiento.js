/* ============================================
   JAVASCRIPT ESPECÍFICO - ASIGNAR ASIENTO
   Scripts únicos para asignar-asiento.html
   Ahora consume datos reales de la base de datos
   ============================================ */

let reservaActualId = null;
let tiquetesActuales = [];

// Formatear fecha
function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Actualizar UI para el tiquete seleccionado
function actualizarDetalleTiqueteUI(tiquete, data) {
    const claseActual = tiquete ? tiquete.clase_tiquete : 'Sin asignar';
    document.getElementById('detClase').innerText = claseActual;
    
    const asientoActual = tiquete ? tiquete.numero_asiento : 'Sin asignar';
    const asientoEl = document.getElementById('detAsientoActual');
    asientoEl.innerText = asientoActual;
    asientoEl.style.color = tiquete && tiquete.numero_asiento !== 'Sin asignar' ? 'green' : 'var(--vino)';

    // Llenar campos de formulario de la derecha
    const claseSelect = document.getElementById('claseAsiento');
    if (claseSelect) {
        if (claseActual.toLowerCase().includes('ejecut')) {
            claseSelect.value = 'ejecutiva';
        } else if (claseActual.toLowerCase().includes('primer')) {
            claseSelect.value = 'primera';
        } else {
            claseSelect.value = 'economica';
        }
    }

    const asientoInput = document.getElementById('numeroAsiento');
    if (asientoInput) {
        asientoInput.value = tiquete && tiquete.numero_asiento !== 'Sin asignar' ? tiquete.numero_asiento : '';
    }

    // Mostrar en el banner de arriba
    const badgeAsiento = document.getElementById('resAsientoActual');
    if (badgeAsiento) {
        badgeAsiento.innerText = asientoActual;
        badgeAsiento.className = `asiento-badge ${tiquete && tiquete.numero_asiento !== 'Sin asignar' ? '' : 'alerta'}`;
    }
    
    const resClase = document.getElementById('resClase');
    if (resClase) {
        resClase.innerText = claseActual;
    }

    // Actualizar mapa visualmente
    marcarAsientoSeleccionadoEnMapa(tiquete && tiquete.numero_asiento !== 'Sin asignar' ? tiquete.numero_asiento : '');
}

// Cargar datos de una reserva para asignación
async function cargarReservaParaAsiento(id) {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas/${id}`);
        if (!response.ok) {
            throw new Error('Reserva no encontrada');
        }
        const data = await response.json();
        
        reservaActualId = data.id_reserva;
        tiquetesActuales = data.tiquetes || (data.tiquete ? [data.tiquete] : []);

        // Mostrar contenedor de asignación
        const container = document.querySelector('.asignar-asiento-container');
        if (container) container.style.display = 'grid';

        // Llenar datos de la reserva en el panel izquierdo
        document.getElementById('detCodigo').innerText = `#RES-${data.id_reserva.toString().padStart(3, '0')}`;
        document.getElementById('detNombre').innerText = data.pasajero.nombre;
        document.getElementById('detDocumento').innerText = `${data.pasajero.tipo_identificacion}: ${data.pasajero.documento}`;
        document.getElementById('detVuelo').innerText = `${data.vuelo.codigo} | ${data.vuelo.origen} → ${data.vuelo.destino}`;
        document.getElementById('detFecha').innerText = formatFecha(data.vuelo.fecha_salida);

        // Datos de contacto
        document.getElementById('detEmail').innerText = data.pasajero.email || 'No registrado';
        document.getElementById('detTelefono').innerText = data.pasajero.telefono || 'No registrado';
        document.getElementById('detDireccion').innerText = data.pasajero.direccion || 'No registrada';

        // Mostrar el banner de "Registro Localizado" arriba
        const resultadoBusqueda = document.getElementById('resultadoBusqueda');
        if (resultadoBusqueda) {
            resultadoBusqueda.style.display = 'block';
            document.getElementById('resNombre').innerText = data.pasajero.nombre;
            document.getElementById('resDocumento').innerText = data.pasajero.documento;
            document.getElementById('resVuelo').innerText = data.vuelo.codigo;
            document.getElementById('resRuta').innerText = `${data.vuelo.origen} → ${data.vuelo.destino}`;

            const badgeRes = document.getElementById('badgeReserva');
            badgeRes.innerText = data.estado;
            badgeRes.className = `estado-badge ${data.estado === 'Confirmada' ? 'confirmada' : 'pendiente'}`;
        }

        // Llenar el selector de pasajeros
        const pasajeroSelect = document.getElementById('pasajeroAsignacionSelect');
        if (pasajeroSelect) {
            pasajeroSelect.innerHTML = '';
            tiquetesActuales.forEach((t, idx) => {
                const nombrePas = t.nombre_pasajero || data.pasajero.nombre || `Pasajero ${idx + 1}`;
                const option = document.createElement('option');
                option.value = t.id_tiquete;
                option.text = `${idx + 1}. ${nombrePas} (Doc: ${t.documento_pasajero || data.pasajero.documento || '-'})`;
                pasajeroSelect.appendChild(option);
            });
            
            // Asignar listener
            pasajeroSelect.onchange = function() {
                const selectedTiqueteId = parseInt(this.value);
                const selectedTiquete = tiquetesActuales.find(t => t.id_tiquete === selectedTiqueteId);
                if (selectedTiquete) {
                    actualizarDetalleTiqueteUI(selectedTiquete, data);
                }
            };
        }

        // Mostrar el primer tiquete por defecto
        if (tiquetesActuales.length > 0) {
            if (pasajeroSelect) {
                pasajeroSelect.value = tiquetesActuales[0].id_tiquete;
            }
            actualizarDetalleTiqueteUI(tiquetesActuales[0], data);
        }

    } catch (error) {
        console.error('Error al cargar la reserva:', error);
        alert(`No se pudo cargar la reserva #${id}.`);
    }
}

// Buscar reserva por input
function buscarReservaInput() {
    const inputVal = document.getElementById('pnrSearch')?.value || '';
    if (!inputVal.trim()) {
        alert('Por favor ingrese un código o número de reserva.');
        return;
    }

    // Extraer número ID (ej: "#RES-003" -> 3)
    const match = inputVal.match(/\d+/);
    if (!match) {
        alert('Formato de código inválido. Por favor use el número de reserva (ej. 3 o #RES-003).');
        return;
    }

    const id = parseInt(match[0]);
    cargarReservaParaAsiento(id);
}

// Cargar la cola de procesamiento (Reservas confirmadas sin asiento)
async function cargarColaProcesamiento() {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas`);
        if (!response.ok) throw new Error('Error al obtener lista de reservas');
        const reservas = await response.json();
        
        // Filtramos: reservas que estén Confirmadas y NO tengan asiento asignado
        // (o si tienen 'Sin asignar' o similar en la bd)
        const pendientes = reservas.filter(r => 
            r.estado === 'Confirmada' && (!r.numero_asiento || r.numero_asiento === 'Sin asignar' || r.numero_asiento === '-')
        );

        const tbody = document.getElementById('colaAsignacionBody');
        tbody.innerHTML = '';

        if (pendientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--texto-mutado);">No hay reservas confirmadas pendientes de asignación de asiento.</td></tr>`;
            return;
        }

        pendientes.forEach(res => {
            const fecha = new Date(res.fecha_hora_reserva);
            const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

            const row = `<tr>
                <td><span class="pnr-code">#RES-${res.id_reserva.toString().padStart(3, '0')}</span></td>
                <td>
                    <div class="pasajero-info">
                        <span class="nombre">${res.nombre_completo}</span>
                    </div>
                </td>
                <td>${res.cod_vuelo} | ${res.origen} → ${res.destino}</td>
                <td>${fechaStr}</td>
                <td><span class="estado confirmada">${res.estado}</span></td>
                <td><span class="asiento-badge alerta">Sin asignar</span></td>
                <td>
                    <button class="btn-tabla-accion primary" onclick="cargarReservaParaAsiento(${res.id_reserva})">
                        <i class="fas fa-chair"></i> Asignar
                    </button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error al cargar la cola de procesamiento:', error);
        document.getElementById('colaAsignacionBody').innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Error de red al cargar la cola de procesamiento.</td></tr>`;
    }
}

// Configurar mapa de asientos interactivo
function configurarMapaInteractivo() {
    const asientosLibres = document.querySelectorAll('.mapa-asientos .asiento.libre');
    
    asientosLibres.forEach(asiento => {
        asiento.style.cursor = 'pointer';
        asiento.addEventListener('click', function() {
            // Quitar clase seleccionado de todos
            document.querySelectorAll('.mapa-asientos .asiento').forEach(a => a.classList.remove('seleccionado-agente'));
            
            // Añadir clase al seleccionado
            this.classList.add('seleccionado-agente');
            
            // Obtener fila y letra
            const fila = this.parentElement.querySelector('.fila-numero').innerText;
            const letra = this.innerText;
            
            // Colocar en el input
            const numAsientoInput = document.getElementById('numeroAsiento');
            if (numAsientoInput) {
                numAsientoInput.value = `${fila}${letra}`;
            }
        });
    });
}

// Marcar asiento actual en el mapa visual
function marcarAsientoSeleccionadoEnMapa(asientoCod) {
    // Limpiar selecciones previas
    document.querySelectorAll('.mapa-asientos .asiento').forEach(a => a.classList.remove('seleccionado-agente'));
    
    if (!asientoCod) return;

    // Extraer número de fila y letra
    const match = asientoCod.match(/^(\d+)([A-F])$/i);
    if (!match) return;

    const filaBusqueda = match[1];
    const letraBusqueda = match[2].toUpperCase();

    const filas = document.querySelectorAll('.mapa-asientos .fila');
    filas.forEach(fila => {
        const num = fila.querySelector('.fila-numero')?.innerText;
        if (num === filaBusqueda) {
            const asientos = fila.querySelectorAll('.asiento');
            asientos.forEach(asiento => {
                if (asiento.innerText === letraBusqueda) {
                    asiento.classList.remove('ocupado'); // Si estaba ocupado, lo marcamos seleccionado para este cliente
                    asiento.classList.add('seleccionado-agente');
                }
            });
        }
    });
}

// Asignar el asiento formalmente mediante la API
async function guardarAsignacionAsiento() {
    if (!reservaActualId) {
        alert('Por favor localice primero una reserva.');
        return;
    }

    const numAsiento = document.getElementById('numeroAsiento')?.value || '';
    const claseSelect = document.getElementById('claseAsiento');
    let claseTiquete = 'Economica';
    
    if (claseSelect) {
        if (claseSelect.value === 'ejecutiva') claseTiquete = 'Ejecutiva';
        else if (claseSelect.value === 'primera') claseTiquete = 'Primera Clase';
    }

    if (!numAsiento.trim()) {
        alert('Por favor ingrese o seleccione un número de asiento.');
        return;
    }

    // Validar formato simple (ej: 4A, 12B)
    if (!/^\d+[A-F]$/i.test(numAsiento)) {
        alert('Formato de asiento no válido. Debe ser un número seguido de una letra de la A a la F (Ej: 12C).');
        return;
    }

    // Obtener el tiquete seleccionado
    const pasajeroSelect = document.getElementById('pasajeroAsignacionSelect');
    const selectedTiqueteId = pasajeroSelect ? parseInt(pasajeroSelect.value) : null;

    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas/${reservaActualId}/asiento`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numero_asiento: numAsiento.toUpperCase(),
                clase_tiquete: claseTiquete,
                id_tiquete: selectedTiqueteId
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('¡Asiento y cabina asignados correctamente para este pasajero!');
            await cargarReservaParaAsiento(reservaActualId);
            
            // Mantener seleccionado el tiquete que acabamos de modificar
            if (pasajeroSelect && selectedTiqueteId) {
                pasajeroSelect.value = selectedTiqueteId;
                const updatedTiquete = tiquetesActuales.find(t => t.id_tiquete === selectedTiqueteId);
                if (updatedTiquete) {
                    actualizarDetalleTiqueteUI(updatedTiquete, { pasajero: {} });
                }
            }
            
            cargarColaProcesamiento();
        } else {
            alert(`Error al asignar asiento: ${result.error}`);
        }
    } catch (error) {
        console.error('Error al guardar asiento:', error);
        alert('Ocurrió un error al intentar asignar el asiento.');
    }
}

// Cancelar asignación
function cancelarAsignacion() {
    if (confirm('¿Desea cancelar y volver a la lista de reservas?')) {
        window.location.href = 'reservas.html';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarColaProcesamiento();
    configurarMapaInteractivo();

    // Buscar si hay un ID en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idUrl = urlParams.get('id');
    if (idUrl) {
        cargarReservaParaAsiento(idUrl);
    } else {
        // Ocultar panel de asignación si no se ha buscado nada
        const container = document.querySelector('.asignar-asiento-container');
        if (container) container.style.display = 'none';
    }

    // Configurar listeners de botones
    const btnBuscar = document.getElementById('btnBuscarReserva');
    if (btnBuscar) btnBuscar.addEventListener('click', buscarReservaInput);

    const inputSearch = document.getElementById('pnrSearch');
    if (inputSearch) {
        inputSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') buscarReservaInput();
        });
    }

    const btnAsignar = document.querySelector('.btn-asignar-ahora');
    if (btnAsignar) btnAsignar.addEventListener('click', guardarAsignacionAsiento);

    const btnCancelar = document.querySelector('.btn-cancelar-asignacion');
    if (btnCancelar) btnCancelar.addEventListener('click', cancelarAsignacion);

    // Cambiar texto de cabina en el mapa cuando cambie el selector de clase
    const claseSelect = document.getElementById('claseAsiento');
    if (claseSelect) {
        claseSelect.addEventListener('change', function() {
            const h5 = document.querySelector('.mapa-asientos h5');
            if (h5) {
                h5.innerText = `Mapa de asientos (${this.options[this.selectedIndex].text.split(' ')[0]})`;
            }
        });
    }
});
