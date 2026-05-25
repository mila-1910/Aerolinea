/* ============================================
   JAVASCRIPT ESPECÍFICO - CONFIRMAR PAGO
   Scripts únicos para confirmar-pago.html
   Ahora consume datos reales de la base de datos
   ============================================ */

// Formatear moneda COP
function formatCOP(valor) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}

// Formatear fecha
function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

let estadoReservaActualPago = null;

// Cargar datos de la reserva desde la API
async function cargarReservaPago(id) {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas/${id}`);
        if (!response.ok) {
            throw new Error('Reserva no encontrada');
        }
        const data = await response.json();
        estadoReservaActualPago = data.estado;

        if (data.estado === 'Confirmada') {
            alert('Este pago ya fue confirmado anteriormente. Serás redirigido a la gestión de reservas.');
            window.location.href = 'reservas.html';
            return;
        }

        const validarBtn = document.getElementById('btnValidarPago');
        if (validarBtn) {
            validarBtn.disabled = false;
            validarBtn.classList.remove('disabled');
            validarBtn.removeAttribute('title');
        }
        
        // Rellenar los campos principales
        document.getElementById('pnrCode').innerText = `#RES-${data.id_reserva.toString().padStart(3, '0')}`;
        document.getElementById('nombreCliente').innerText = data.pasajero.nombre;
        document.getElementById('vueloAsignado').innerText = `${data.vuelo.codigo} | ${data.vuelo.origen} → ${data.vuelo.destino}`;
        document.getElementById('claseCabina').innerText = data.tiquete 
            ? `${data.tiquete.clase_tiquete} (Asiento: ${data.tiquete.numero_asiento})` 
            : 'Sin tiquete asignado';
        document.getElementById('fechaViaje').innerText = formatFecha(data.vuelo.fecha_salida);
        
        // Estado
        const estadoActualEl = document.getElementById('estadoActual');
        estadoActualEl.innerText = data.estado;
        estadoActualEl.className = `estado-pago-badge ${data.estado === 'Confirmada' ? 'confirmado' : 'pendiente'}`;

        // Métodos de pago
        document.getElementById('metodoPago').innerText = 'Validación Electrónica / Consigna';
        
        // Importe y desglose financiero
        const tarifaBase = parseFloat(data.vuelo.precio_base);
        const impuestos = tarifaBase * 0.19;
        const totalPaquetes = data.paquetes ? data.paquetes.reduce((sum, p) => sum + parseFloat(p.precio), 0) : 0;
        
        document.getElementById('importeTotal').innerText = formatCOP(data.valor_total);
        document.getElementById('tarifaBase').innerText = formatCOP(tarifaBase);
        document.getElementById('impuestos').innerText = formatCOP(impuestos);
        document.getElementById('seguro').innerText = formatCOP(totalPaquetes);

        // Cargar historial del cliente (otras reservas)
        cargarHistorialCliente(data.pasajero.documento, data.id_reserva);

    } catch (error) {
        console.error('Error al cargar datos del pago:', error);
        alert('Error al cargar la información del pago de la reserva.');
        window.location.href = 'reservas.html';
    }
}

// Cargar otras reservas del mismo cliente
async function cargarHistorialCliente(documentoCliente, idReservaActual) {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas`);
        if (!response.ok) throw new Error('Error al obtener lista de reservas');
        const reservas = await response.json();
        
        const filtradas = reservas.filter(r => r.numero_identificacion === documentoCliente && r.id_reserva !== parseInt(idReservaActual));
        
        const tbody = document.getElementById('historialClienteBody');
        tbody.innerHTML = '';
        
        if (filtradas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--texto-mutado);">No se encontraron otras reservas para este cliente.</td></tr>`;
            return;
        }

        filtradas.forEach(res => {
            const fecha = new Date(res.fecha_hora_reserva);
            const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            
            let estadoClase = 'pendiente';
            if (res.estado === 'Confirmada') estadoClase = 'confirmada';
            else if (res.estado === 'Cancelada' || res.estado === 'Expirada') estadoClase = 'cancelada';

            const row = `<tr>
                <td><span class="pnr-code">#RES-${res.id_reserva.toString().padStart(3, '0')}</span></td>
                <td>${res.origen} → ${res.destino}</td>
                <td>${fechaStr}</td>
                <td><span class="estado ${estadoClase}">${res.estado}</span></td>
                <td><a href="detalle-reserva.html?id=${res.id_reserva}" class="btn-tabla-accion secondary">Auditar</a></td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al cargar historial del cliente:', error);
        document.getElementById('historialClienteBody').innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">No se pudo cargar el historial del cliente.</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) {
        alert('No se especificó un ID de reserva.');
        window.location.href = 'reservas.html';
        return;
    }

    cargarReservaPago(id);

    // Botón Confirmar Transacción (Validar)
    document.getElementById('btnValidarPago')?.addEventListener('click', async () => {
        if (estadoReservaActualPago === 'Confirmada') {
            alert('Este pago ya fue confirmado anteriormente. Serás redirigido a la gestión de reservas.');
            window.location.href = 'reservas.html';
            return;
        }

        const observacion = document.getElementById('notasConciliacion')?.value || '';
        if (confirm('¿Confirmar e informar la validación del pago para esta reserva?')) {
            try {
                const response = await fetch(`${window.API_BASE || ''}/api/reservas/${id}/estado`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        nombre_estado: 'Confirmada',
                        notas: observacion // Enviamos notas si el backend las soporta (o para historial)
                    })
                });
                
                const result = await response.json();
                if (response.ok) {
                    alert('¡Pago validado exitosamente! La reserva ahora está Confirmada.');
                    window.location.href = 'reservas.html';
                } else {
                    alert(`Error al validar: ${result.error}`);
                }
            } catch (error) {
                console.error('Error al confirmar pago:', error);
                alert('Ocurrió un error de red al procesar el pago.');
            }
        }
    });

    // Botón Denegar Pago (Rechazar)
    document.getElementById('btnDenegarPago')?.addEventListener('click', async () => {
        const observacion = document.getElementById('notasConciliacion')?.value || '';
        if (confirm('¿Está seguro de que desea DENEGAR el pago y cancelar esta reserva?')) {
            try {
                const response = await fetch(`${window.API_BASE || ''}/api/reservas/${id}/cancelar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notas: observacion })
                });
                
                const result = await response.json();
                if (response.ok) {
                    alert('Pago denegado y reserva cancelada de forma segura.');
                    window.location.href = `detalle-reserva.html?id=${id}`;
                } else {
                    alert(`Error al rechazar: ${result.error}`);
                }
            } catch (error) {
                console.error('Error al denegar pago:', error);
                alert('Ocurrió un error de red al rechazar el pago.');
            }
        }
    });
});
