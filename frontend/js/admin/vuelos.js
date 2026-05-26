/* ============================================
   GESTIÓN DE VUELOS - MÓDULO ADMINISTRADOR
   ============================================ */

let vuelosGlobal = [];
let modoEdicion = false;
let idVueloEdicion = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarVuelos();
    document.getElementById('btnCrearVuelo').addEventListener('click', abrirModalCrear);
    document.getElementById('formVuelo').addEventListener('submit', guardarVuelo);
});

// ✅ Cargar vuelos desde el backend
async function cargarVuelos() {
    try {
        const response = await fetch('http://localhost:3000/api/vuelos');
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        vuelosGlobal = await response.json();
        mostrarVuelos(vuelosGlobal);
    } catch (error) {
        console.error('❌ Error al cargar vuelos:', error);
        document.getElementById('bodyTablaVuelos').innerHTML = `
            <tr><td colspan="7" style="text-align: center; color: red;">
                Error al cargar los vuelos
            </td></tr>
        `;
    }
}

// ✅ Mostrar vuelos en la tabla
function mostrarVuelos(vuelos) {
    const tbody = document.getElementById('bodyTablaVuelos');

    if (!vuelos || vuelos.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="7" style="text-align: center; padding: 20px;">
                <i class="fas fa-inbox"></i> No hay vuelos registrados
            </td></tr>
        `;
        return;
    }

    tbody.innerHTML = vuelos.map(vuelo => `
        <tr>
            <td><strong>${vuelo.cod_vuelo || vuelo.numero_vuelo}</strong></td>
            <td>${vuelo.origen || vuelo.ciudad_origen}</td>
            <td>${vuelo.destino || vuelo.ciudad_destino}</td>
            <td>${formatearFecha(vuelo.fecha_salida || vuelo.fecha_hora_salida)}</td>
            <td>$${parseFloat(vuelo.precio_base).toLocaleString('es-CO')}</td>
            <td><span class="badge-estado confirmada">${vuelo.estado_vuelo || 'Activo'}</span></td>
            <td>
                <button class="btn-tabla-accion" onclick="editarVuelo('${vuelo.cod_vuelo}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-tabla-accion" onclick="eliminarVuelo('${vuelo.cod_vuelo}')" title="Eliminar" style="color: var(--rojo-error);">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ✅ Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ✅ Abrir modal para crear
function abrirModalCrear() {
    modoEdicion = false;
    idVueloEdicion = null;
    document.getElementById('modalTitulo').textContent = 'Crear Nuevo Vuelo';
    document.getElementById('formVuelo').reset();
    document.getElementById('codigoVuelo').disabled = false;
    abrirModal('modalVuelo');
}

// ✅ Editar vuelo
function editarVuelo(codigoVuelo) {
    const vuelo = vuelosGlobal.find(v => v.cod_vuelo === codigoVuelo);
    if (!vuelo) {
        alert('Vuelo no encontrado');
        return;
    }

    modoEdicion = true;
    idVueloEdicion = codigoVuelo;
    document.getElementById('modalTitulo').textContent = 'Editar Vuelo';

    document.getElementById('codigoVuelo').value = vuelo.cod_vuelo;
    document.getElementById('codigoVuelo').disabled = true;
    document.getElementById('ciudadOrigen').value = vuelo.origen || vuelo.ciudad_origen;
    document.getElementById('ciudadDestino').value = vuelo.destino || vuelo.ciudad_destino;
    document.getElementById('fechaSalida').value = formatearFechaInput(vuelo.fecha_salida || vuelo.fecha_hora_salida);
    document.getElementById('fechaLlegada').value = formatearFechaInput(vuelo.fecha_llegada || vuelo.fecha_hora_llegada);
    document.getElementById('precioBase').value = vuelo.precio_base;
    document.getElementById('capacidadPasajeros').value = vuelo.capacidad_pasajeros || 100;
    document.getElementById('estadoVuelo').value = vuelo.estado_vuelo || 'Programado';

    abrirModal('modalVuelo');
}

// ✅ Guardar vuelo (crear o editar)
async function guardarVuelo(e) {
    e.preventDefault();

    const codigo = document.getElementById('codigoVuelo').value;
    const datos = {
        cod_vuelo: codigo,
        ciudad_origen: document.getElementById('ciudadOrigen').value,
        ciudad_destino: document.getElementById('ciudadDestino').value,
        fecha_hora_salida: document.getElementById('fechaSalida').value,
        fecha_hora_llegada: document.getElementById('fechaLlegada').value,
        precio_base: parseFloat(document.getElementById('precioBase').value),
        capacidad_pasajeros: parseInt(document.getElementById('capacidadPasajeros').value),
        estado_vuelo: document.getElementById('estadoVuelo').value
    };

    try {
        let response;
        if (modoEdicion) {
            response = await fetch(`http://localhost:3000/api/vuelos/${codigo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
        } else {
            response = await fetch('http://localhost:3000/api/vuelos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
        }

        const textoRespuesta = await response.text();
        let payload;

        try {
            payload = textoRespuesta ? JSON.parse(textoRespuesta) : null;
        } catch (error) {
            payload = null;
        }

        if (!response.ok) {
            throw new Error(payload?.error || `Error ${response.status}: ${textoRespuesta || 'No se pudo guardar el vuelo'}`);
        }

        alert(modoEdicion ? '✅ Vuelo actualizado correctamente' : '✅ Vuelo creado correctamente');
        cerrarModal('modalVuelo');
        cargarVuelos();
    } catch (error) {
        console.error('❌ Error:', error);
        alert(error.message || 'Error al guardar el vuelo');
    }
}

// ✅ Eliminar vuelo
async function eliminarVuelo(codigoVuelo) {
    if (!confirm('¿Está seguro de que desea eliminar este vuelo?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/vuelos/${codigoVuelo}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        alert('✅ Vuelo eliminado correctamente');
        cargarVuelos();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al eliminar el vuelo');
    }
}

// ✅ Utilidades de modal
function abrirModal(idModal) {
    document.getElementById(idModal).classList.add('active');
}

function cerrarModal(idModal) {
    document.getElementById(idModal).classList.remove('active');
    document.getElementById('codigoVuelo').disabled = false;
}

// ✅ Formatear fecha para input datetime-local
function formatearFechaInput(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    const año = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const día = String(d.getDate()).padStart(2, '0');
    const hora = String(d.getHours()).padStart(2, '0');
    const minuto = String(d.getMinutes()).padStart(2, '0');
    return `${año}-${mes}-${día}T${hora}:${minuto}`;
}
