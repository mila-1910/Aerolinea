/* ============================================
   GESTIÓN DE UBICACIONES - MÓDULO ADMINISTRADOR
   ============================================ */

let ubicacionesGlobal = [];
let modoEdicion = false;
let idUbicacionEdicion = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarUbicaciones();
    document.getElementById('btnAgregarUbicacion').addEventListener('click', abrirModalCrear);
    document.getElementById('formUbicacion').addEventListener('submit', guardarUbicacion);
    document.getElementById('searchUbicaciones').addEventListener('keyup', function() {
        filtrarUbicaciones(this.value);
    });
});

// ✅ Cargar ubicaciones desde el backend
async function cargarUbicaciones() {
    try {
        const response = await fetch('http://localhost:3000/api/ubicaciones');
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        ubicacionesGlobal = await response.json();
        mostrarUbicaciones(ubicacionesGlobal);
    } catch (error) {
        console.error('❌ Error al cargar ubicaciones:', error);
        document.getElementById('bodyTablaUbicaciones').innerHTML = `
            <tr><td colspan="5" style="text-align: center; color: red;">
                Error al cargar las ubicaciones
            </td></tr>
        `;
    }
}

// ✅ Mostrar ubicaciones en la tabla
function mostrarUbicaciones(ubicaciones) {
    const tbody = document.getElementById('bodyTablaUbicaciones');

    if (!ubicaciones || ubicaciones.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="5" style="text-align: center; padding: 20px;">
                <i class="fas fa-inbox"></i> No hay ubicaciones registradas
            </td></tr>
        `;
        return;
    }

    tbody.innerHTML = ubicaciones.map((ubicacion, index) => `
        <tr>
            <td><span class="reserva-id">#UB-${String(ubicacion.id_ubicacion || index + 1).padStart(3, '0')}</span></td>
            <td><strong>${ubicacion.ciudad}</strong></td>
            <td>${ubicacion.pais}</td>
            <td>${ubicacion.nombre_aeropuerto} (${ubicacion.codigo_aeropuerto})</td>
            <td>
                <button class="btn-tabla-accion" onclick="editarUbicacion(${ubicacion.id_ubicacion})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-tabla-accion" onclick="eliminarUbicacion(${ubicacion.id_ubicacion})" title="Eliminar" style="color: var(--rojo-error);">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ✅ Filtrar ubicaciones
function filtrarUbicaciones(termino) {
    const tabla = document.getElementById('tablaUbicaciones');
    const filas = tabla.querySelectorAll('tbody tr');
    const terminoLower = termino.toLowerCase();

    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        fila.style.display = texto.includes(terminoLower) ? '' : 'none';
    });
}

// ✅ Abrir modal para crear
function abrirModalCrear() {
    modoEdicion = false;
    idUbicacionEdicion = null;
    document.getElementById('modalTitulo').textContent = 'Agregar Ubicación';
    document.getElementById('formUbicacion').reset();
    abrirModal('modalUbicacion');
}

// ✅ Editar ubicación
function editarUbicacion(idUbicacion) {
    const ubicacion = ubicacionesGlobal.find(u => u.id_ubicacion === idUbicacion);
    if (!ubicacion) {
        alert('Ubicación no encontrada');
        return;
    }

    modoEdicion = true;
    idUbicacionEdicion = idUbicacion;
    document.getElementById('modalTitulo').textContent = 'Editar Ubicación';

    document.getElementById('ciudad').value = ubicacion.ciudad;
    document.getElementById('pais').value = ubicacion.pais;
    document.getElementById('aeropuerto').value = ubicacion.nombre_aeropuerto;
    document.getElementById('codigoAeropuerto').value = ubicacion.codigo_aeropuerto;

    abrirModal('modalUbicacion');
}

// ✅ Guardar ubicación (crear o editar)
async function guardarUbicacion(e) {
    e.preventDefault();

    const datos = {
        ciudad: document.getElementById('ciudad').value,
        pais: document.getElementById('pais').value,
        nombre_aeropuerto: document.getElementById('aeropuerto').value,
        codigo_aeropuerto: document.getElementById('codigoAeropuerto').value
    };

    try {
        let response;
        if (modoEdicion) {
            response = await fetch(`http://localhost:3000/api/ubicaciones/${idUbicacionEdicion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
        } else {
            response = await fetch('http://localhost:3000/api/ubicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
        }

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        alert(modoEdicion ? '✅ Ubicación actualizada correctamente' : '✅ Ubicación creada correctamente');
        cerrarModal('modalUbicacion');
        cargarUbicaciones();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al guardar la ubicación');
    }
}

// ✅ Eliminar ubicación
async function eliminarUbicacion(idUbicacion) {
    if (!confirm('¿Está seguro de que desea eliminar esta ubicación?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/ubicaciones/${idUbicacion}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        alert('✅ Ubicación eliminada correctamente');
        cargarUbicaciones();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al eliminar la ubicación');
    }
}

// ✅ Utilidades de modal
function abrirModal(idModal) {
    document.getElementById(idModal).classList.add('active');
}

function cerrarModal(idModal) {
    document.getElementById(idModal).classList.remove('active');
}
