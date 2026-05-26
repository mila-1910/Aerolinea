/* ============================================
   JAVASCRIPT ESPECÍFICO - DETALLE RESERVA
   Scripts únicos para detalle-reserva.html
   Ahora consume datos reales de la base de datos
   ============================================ */

// Formatear moneda COP
function formatCOP(valor) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}

// Formatear fecha completa
function formatFechaCompleta(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const fechaStr = fecha.toLocaleDateString('es-ES', opciones);
    const horaStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${fechaStr} - ${horaStr}`;
}

// Formatear solo fecha
function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Formatear solo hora
function formatHora(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

let estadoReservaActual = null;

// Cargar datos de la reserva desde la API
async function cargarReservaDesdeAPI(id) {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas/${id}`);
        if (!response.ok) {
            throw new Error('Reserva no encontrada');
        }
        const data = await response.json();
        renderizarReserva(data, id);
    } catch (error) {
        console.error('Error al cargar reserva:', error);
        alert(`No se pudo cargar la reserva #${id}. Redirigiendo a la lista de reservas.`);
        window.location.href = 'reservas.html';
    }
}

// Renderizar los datos de la reserva en la página
function renderizarReserva(data, id) {
    // --- Datos del pasajero ---
    document.getElementById('codigoReserva').innerText = `#RES-${data.id_reserva.toString().padStart(3, '0')}`;
    document.getElementById('nombrePasajero').innerText = data.pasajero.nombre;
    document.getElementById('documentoPasajero').innerText = `${data.pasajero.tipo_identificacion}: ${data.pasajero.documento}`;
    
    // Nacionalidad y fecha de nacimiento no están en la BD actual
    const nacionalidadEl = document.getElementById('nacionalidad');
    if (nacionalidadEl) nacionalidadEl.innerText = 'No registrada';
    const fechaNacEl = document.getElementById('fechaNac');
    if (fechaNacEl) fechaNacEl.innerText = 'No registrada';
    
    document.getElementById('email').innerText = data.pasajero.email || 'No registrado';
    document.getElementById('telefono').innerText = data.pasajero.telefono || 'No registrado';

    // --- Datos del vuelo ---
    document.getElementById('codigoVuelo').innerText = data.vuelo.codigo;
    document.getElementById('origen').innerText = data.vuelo.origen;
    document.getElementById('destino').innerText = data.vuelo.destino;
    document.getElementById('fechaSalida').innerText = formatFecha(data.vuelo.fecha_salida);
    document.getElementById('horaSalida').innerText = formatHora(data.vuelo.fecha_salida);
    document.getElementById('horaLlegada').innerText = formatHora(data.vuelo.fecha_llegada);
    
    // Clase y asiento del tiquete
    const claseEl = document.getElementById('clase');
    const asientoEl = document.getElementById('asiento');
    if (data.tiquete) {
        claseEl.innerText = data.tiquete.clase_tiquete;
        asientoEl.innerText = data.tiquete.numero_asiento;
    } else {
        claseEl.innerText = 'Sin tiquete asignado';
        asientoEl.innerText = 'Sin asignar';
    }

    // Renderizar lista completa de tiquetes y pasajeros
    const listaTiquetesContenedor = document.getElementById('lista-tiquetes-agente');
    if (listaTiquetesContenedor) {
        listaTiquetesContenedor.innerHTML = '';
        
        const tiquetes = data.tiquetes || (data.tiquete ? [data.tiquete] : []);
        
        if (tiquetes.length === 0) {
            listaTiquetesContenedor.innerHTML = '<span style="color:var(--gris-subtle);">Sin tiquetes registrados</span>';
        } else {
            tiquetes.forEach((t, idx) => {
                const itemDiv = document.createElement('div');
                itemDiv.style.background = 'rgba(255, 255, 255, 0.02)';
                itemDiv.style.border = '1px solid var(--borde)';
                itemDiv.style.borderRadius = '8px';
                itemDiv.style.padding = '10px 12px';
                itemDiv.style.fontSize = '0.9rem';
                itemDiv.style.display = 'flex';
                itemDiv.style.flexDirection = 'column';
                itemDiv.style.gap = '4px';
                
                const nombrePasajero = t.nombre_pasajero || data.pasajero.nombre || `Pasajero ${idx + 1}`;
                const documentoPasajero = t.documento_pasajero || data.pasajero.documento || 'No registrado';
                const asientoLabel = t.numero_asiento === 'Sin asignar' 
                    ? '<span class="asiento-badge alerta" style="background:#f8d7da; color:#842029; padding:2px 6px; border-radius:4px; font-size:0.75rem; font-weight:bold; display:inline-block;">Sin Asiento</span>' 
                    : `<span class="asiento-badge" style="background:#d1e7dd; color:#0f5132; padding:2px 6px; border-radius:4px; font-size:0.75rem; font-weight:bold; display:inline-block;">Asiento ${t.numero_asiento}</span>`;
                
                itemDiv.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:700; color:var(--oro-premium);">${idx + 1}. ${nombrePasajero}</span>
                        ${asientoLabel}
                    </div>
                    <div style="font-size:0.8rem; color:var(--gris-subtle); display:flex; justify-content:space-between; margin-top:2px;">
                        <span>Doc: ${documentoPasajero}</span>
                        <span>Clase: <strong>${t.clase_tiquete}</strong></span>
                    </div>
                `;
                listaTiquetesContenedor.appendChild(itemDiv);
            });
        }
    }

    // --- Información financiera ---
    const estadoPago = data.estado === 'Confirmada' ? 'Confirmado' : 'Pendiente';
    const estadoPagoSpan = document.getElementById('estadoPagoBadge');
    estadoPagoSpan.innerText = estadoPago;
    estadoPagoSpan.className = `estado-pago-badge ${estadoPago === 'Pendiente' ? 'pendiente' : 'confirmado'}`;
    
    const metodoPagoEl = document.getElementById('metodoPago');
    if (metodoPagoEl) metodoPagoEl.innerText = 'No especificado';
    
    document.getElementById('montoTotal').innerText = formatCOP(data.valor_total);
    document.getElementById('precioBase').innerText = formatCOP(data.vuelo.precio_base);
    
    // Paquetes turísticos
    const paquetesEl = document.getElementById('paquetes');
    if (data.paquetes && data.paquetes.length > 0) {
        const totalPaquetes = data.paquetes.reduce((sum, p) => sum + parseFloat(p.precio), 0);
        const nombresPaquetes = data.paquetes.map(p => p.nombre_paquete).join(', ');
        paquetesEl.innerText = `${formatCOP(totalPaquetes)} (${nombresPaquetes})`;
    } else {
        paquetesEl.innerText = 'Sin paquetes adicionales';
    }

    // --- Estado operativo ---
    estadoReservaActual = data.estado;
    const estadoReservaSpan = document.getElementById('estadoReservaBadge');
    estadoReservaSpan.innerText = data.estado;
    let estadoClase = 'pendiente';
    if (data.estado === 'Confirmada') estadoClase = 'confirmada';
    else if (data.estado === 'Cancelada' || data.estado === 'Expirada') estadoClase = 'cancelada';
    estadoReservaSpan.className = `estado ${estadoClase}`;

    const confirmarBtn = document.getElementById('btnConfirmarPago');
    const asignarBtn = document.getElementById('btnAsignarAsiento');

    if (confirmarBtn) {
        if (data.estado === 'Confirmada') {
            confirmarBtn.disabled = true;
            confirmarBtn.classList.add('disabled');
            confirmarBtn.title = 'Esta reserva ya está confirmada';
        } else {
            confirmarBtn.disabled = false;
            confirmarBtn.classList.remove('disabled');
            confirmarBtn.removeAttribute('title');
        }
    }

    if (asignarBtn) {
        if (data.estado === 'Confirmada') {
            asignarBtn.href = `asignar-asiento.html?id=${id}`;
            asignarBtn.classList.remove('disabled');
            asignarBtn.removeAttribute('title');
            asignarBtn.onclick = null;
        } else {
            asignarBtn.href = '#';
            asignarBtn.classList.add('disabled');
            asignarBtn.title = 'Debe confirmar el pago antes de asignar el asiento';
            asignarBtn.onclick = function (e) {
                e.preventDefault();
                alert('Debe confirmar el pago antes de asignar el asiento.');
            };
        }
    }
    
    document.getElementById('fechaReserva').innerText = formatFechaCompleta(data.fecha_hora_reserva);
    
    // Última modificación = último registro del historial
    const ultimaModEl = document.getElementById('ultimaModificacion');
    if (data.historial && data.historial.length > 0) {
        const ultimo = data.historial[data.historial.length - 1];
        ultimaModEl.innerText = formatFechaCompleta(ultimo.fecha_hora_cambio);
    } else {
        ultimaModEl.innerText = formatFechaCompleta(data.fecha_hora_reserva);
    }

    // --- Historial de estados ---
    const tbody = document.getElementById('historialBody');
    tbody.innerHTML = '';
    if (data.historial && data.historial.length > 0) {
        data.historial.forEach((item, index) => {
            const fecha = new Date(item.fecha_hora_cambio);
            const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const horaStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            // El estado anterior es el estado del registro anterior, o "-" si es el primero
            const anterior = index > 0 ? data.historial[index - 1].nombre_estado : '-';
            
            const row = `<tr>
                <td>${fechaStr}</td>
                <td>${horaStr}</td>
                <td>${anterior}</td>
                <td>${item.nombre_estado}</td>
                <td>Sistema</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Sin historial registrado</td></tr>`;
    }

    // --- Actualizar enlaces de botones ---
    const btnConfirmar = document.getElementById('btnConfirmarPago');
    if (btnConfirmar) btnConfirmar.href = `confirmar-pago.html?id=${id}`;
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if (!id) {
        alert('No se especificó un ID de reserva.');
        window.location.href = 'reservas.html';
        return;
    }

    cargarReservaDesdeAPI(id);

    // Botón cancelar reserva (ahora conectado al backend)
    document.getElementById('btnCancelarReserva')?.addEventListener('click', async () => {
        if (confirm('¿Cancelar esta reserva? Esta acción no se puede deshacer.')) {
            try {
                const response = await fetch(`${window.API_BASE || ''}/api/reservas/${id}/cancelar`, { method: 'PUT' });
                const result = await response.json();
                if (response.ok) {
                    alert('Reserva cancelada correctamente.');
                    location.reload();
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error al cancelar:', error);
                alert('Error de conexión al cancelar la reserva.');
            }
        }
    });

    // Botón confirmar pago (cambiar estado a Confirmada)
    document.getElementById('btnConfirmarPago')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (estadoReservaActual === 'Confirmada') {
            alert('El pago de esta reserva ya fue confirmado anteriormente. Serás redirigido a la gestión de reservas.');
            window.location.href = 'reservas.html';
            return;
        }

        if (confirm('¿Confirmar el pago de esta reserva?')) {
            try {
                const response = await fetch(`${window.API_BASE || ''}/api/reservas/${id}/estado`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre_estado: 'Confirmada' })
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Pago confirmado. La reserva ahora está Confirmada.');
                    window.location.href = `asignar-asiento.html?id=${id}`;
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error al confirmar pago:', error);
                alert('Error de conexión al confirmar el pago.');
            }
        }
    });

    // Botón rechazar pago
    document.getElementById('btnRechazarPago')?.addEventListener('click', async () => {
        if (confirm('¿Rechazar el pago de esta reserva?')) {
            try {
                const response = await fetch(`${window.API_BASE || ''}/api/reservas/${id}/estado`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre_estado: 'Cancelada' })
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Pago rechazado. La reserva ha sido cancelada.');
                    location.reload();
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error al rechazar:', error);
                alert('Error de conexión al rechazar el pago.');
            }
        }
    });
});
