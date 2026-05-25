/* ============================================
   GESTIÓN DE PAQUETES - MÓDULO ADMINISTRADOR
   ============================================ */

let paquetesGlobal = [];
let modoEdicion = false;
let idPaqueteEdicion = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarPaquetes();
    document.getElementById('btnCrearPaquete').addEventListener('click', abrirModalCrear);
    document.getElementById('formPaquete').addEventListener('submit', guardarPaquete);
});

// ✅ Cargar paquetes desde el backend
async function cargarPaquetes() {
    try {
        const response = await fetch('http://localhost:3000/api/paquetes');
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        paquetesGlobal = await response.json();
        mostrarPaquetes(paquetesGlobal);
    } catch (error) {
        console.error('❌ Error al cargar paquetes:', error);
        document.getElementById('contenedorPaquetes').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: red;">
                <i class="fas fa-exclamation-circle"></i> Error al cargar los paquetes
            </div>
        `;
    }
}

// ✅ Mostrar paquetes
function mostrarPaquetes(paquetes) {
    const contenedor = document.getElementById('contenedorPaquetes');

    if (!paquetes || paquetes.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-inbox" style="font-size: 32px; color: #999;"></i>
                <p style="color: #666; margin-top: 10px;">No hay paquetes registrados</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = paquetes.map(paquete => `
        <div class="glass-card package-card">
            <div class="package-icon"><i class="fas fa-gift"></i></div>
            <div class="package-details">
                <h3>${paquete.nombre || 'Paquete Sin Nombre'}</h3>
                <p class="package-duration"><i class="far fa-clock"></i> ${paquete.duracion || 0} días</p>
                <p class="package-price">$${parseFloat(paquete.precio).toLocaleString('es-CO')}</p>
                <div class="package-actions">
                    <button class="btn-tabla-accion" onclick="editarPaquete(${paquete.id_paquete})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-tabla-accion" onclick="eliminarPaquete(${paquete.id_paquete})" title="Eliminar" style="color: var(--rojo-error);">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ✅ Abrir modal para crear
function abrirModalCrear() {
    modoEdicion = false;
    idPaqueteEdicion = null;
    document.getElementById('modalTitulo').textContent = 'Crear Nuevo Paquete';
    document.getElementById('formPaquete').reset();
    abrirModal('modalPaquete');
}

// ✅ Editar paquete
function editarPaquete(idPaquete) {
    const paquete = paquetesGlobal.find(p => p.id_paquete === idPaquete);
    if (!paquete) {
        alert('Paquete no encontrado');
        return;
    }

    modoEdicion = true;
    idPaqueteEdicion = idPaquete;
    document.getElementById('modalTitulo').textContent = 'Editar Paquete';

    document.getElementById('nombrePaquete').value = paquete.nombre;
    document.getElementById('descripcionPaquete').value = paquete.descripcion;
    document.getElementById('precioPaquete').value = paquete.precio;
    document.getElementById('duracionPaquete').value = paquete.duracion;
    document.getElementById('destinoPaquete').value = paquete.destino;
    document.getElementById('estadoPaquete').value = paquete.estado || 'Activo';

    abrirModal('modalPaquete');
}

// ✅ Guardar paquete (crear o editar)
async function guardarPaquete(e) {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById('nombrePaquete').value,
        descripcion: document.getElementById('descripcionPaquete').value,
        precio: parseFloat(document.getElementById('precioPaquete').value),
        duracion: parseInt(document.getElementById('duracionPaquete').value),
        destino: document.getElementById('destinoPaquete').value,
        estado: document.getElementById('estadoPaquete').value
    };

    try {
        let response;
        if (modoEdicion) {
            response = await fetch(`http://localhost:3000/api/paquetes/${idPaqueteEdicion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
        } else {
            response = await fetch('http://localhost:3000/api/paquetes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
        }

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        alert(modoEdicion ? '✅ Paquete actualizado correctamente' : '✅ Paquete creado correctamente');
        cerrarModal('modalPaquete');
        cargarPaquetes();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al guardar el paquete');
    }
}

// ✅ Eliminar paquete
async function eliminarPaquete(idPaquete) {
    if (!confirm('¿Está seguro de que desea eliminar este paquete?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/paquetes/${idPaquete}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        alert('✅ Paquete eliminado correctamente');
        cargarPaquetes();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al eliminar el paquete');
    }
}

// ✅ Utilidades de modal
function abrirModal(idModal) {
    document.getElementById(idModal).classList.add('active');
}

function cerrarModal(idModal) {
    document.getElementById(idModal).classList.remove('active');
}
