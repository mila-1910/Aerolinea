/* ============================================
   JAVASCRIPT ESPECÍFICO - DASHBOARD AGENTE
   Scripts únicos para dashboardeagente.html
   ============================================ */

document.addEventListener('DOMContentLoaded', async function() {
    await cargarDatosDashboard();
    agregarEventosBotones();
});

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        cargarDatosDashboard();
    }
});

// Agregar eventos a los botones de quick-links
function agregarEventosBotones() {
    const links = document.querySelectorAll('.quick-link-btn');
    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            const href = link.getAttribute('href');
            
            if (href === 'confirmar-pago.html') {
                e.preventDefault();
                await irAlPrimerPagoReservado();
            } else if (href === 'asignar-asiento.html') {
                e.preventDefault();
                await irAlPrimerAsientoConfirmado();
            }
        });
    });
}

// Redirigir al primer vuelo con estado "Reservado" para confirmar pago
async function irAlPrimerPagoReservado() {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas`);
        if (!response.ok) throw new Error('Error al obtener reservas');
        const reservas = await response.json();
        
        const primerReservado = reservas.find(r => 
            r.estado && r.estado.toLowerCase().includes('reservada')
        );
        
        if (primerReservado) {
            window.location.href = `detalle-reserva.html?id=${primerReservado.id_reserva}`;
        } else {
            mostrarMensajeAlerta('No hay ningún vuelo reservado esperando confirmación de pago.');
        }
    } catch (error) {
        console.error('Error al buscar pagos:', error);
        mostrarMensajeAlerta('Error al buscar reservas pendientes de pago.');
    }
}

// Redirigir al primer vuelo confirmado que necesite asiento
async function irAlPrimerAsientoConfirmado() {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas`);
        if (!response.ok) throw new Error('Error al obtener reservas');
        const reservas = await response.json();
        
        const primerConfirmado = reservas.find(r => 
            r.estado && r.estado.toLowerCase().includes('confirmada') &&
            (!r.numero_asiento || r.numero_asiento === 'Sin asignar')
        );
        
        if (primerConfirmado) {
            window.location.href = `asignar-asiento.html?id=${primerConfirmado.id_reserva}`;
        } else {
            mostrarMensajeAlerta('No hay vuelos confirmados pendientes de asignación de asiento.');
        }
    } catch (error) {
        console.error('Error al buscar asientos:', error);
        mostrarMensajeAlerta('Error al buscar reservas pendientes de asignación de asiento.');
    }
}

// Mostrar mensaje de alerta en el dashboard
function mostrarMensajeAlerta(mensaje) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alerta-dashboard';
    alertDiv.style.cssText = `
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        color: #856404;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    alertDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${mensaje}`;
    
    const contenidoPrincipal = document.querySelector('.contenido-principal');
    if (contenidoPrincipal) {
        const primerElemento = contenidoPrincipal.firstChild;
        contenidoPrincipal.insertBefore(alertDiv, primerElemento.nextSibling);
        
        // Desaparecer después de 5 segundos
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }
}

async function cargarDatosDashboard() {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/dashboard`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al obtener datos del dashboard: ${response.status} ${response.statusText} ${errorText}`);
        }
        const data = await response.json();

        const pendientes = Number(data.pendientes || 0);
        const confirmadas = Number(data.confirmadas || 0);
        const canceladas = Number(data.canceladas || 0);
        const confirmacionPromedio = Number(data.tiempoPromedioConfirmacionMinutos || 0);
        const recientes = Array.isArray(data.recientes) ? data.recientes : [];
        const canceladasRecientes = Array.isArray(data.canceladasRecientes) ? data.canceladasRecientes : [];

        // Actualizar KPIs
        document.getElementById('kpi-pendientes').textContent = pendientes < 10 ? `0${pendientes}` : pendientes;
        document.getElementById('kpi-confirmadas').textContent = confirmadas < 10 ? `0${confirmadas}` : confirmadas;
        document.getElementById('kpi-canceladas').textContent = canceladas < 10 ? `0${canceladas}` : canceladas;
        document.getElementById('kpi-confirmacion').textContent =
            confirmacionPromedio > 0 ? `${confirmacionPromedio} min` : '--';

        // Llenar tabla de reservas recientes
        const tbody = document.getElementById('tbody-reservas-recientes');
        tbody.innerHTML = '';

        if (recientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay reservas recientes</td></tr>`;
            return;
        }

        recientes.forEach(reserva => {
            const tr = document.createElement('tr');
            
            // Determinar clase de estado
            let estadoClase = 'pendiente';
            if (reserva.estado.toLowerCase().includes('confirmada')) estadoClase = 'confirmada';
            else if (reserva.estado.toLowerCase().includes('cancelada')) estadoClase = 'cancelada';
            
            // Formatear fecha
            const fechaObj = new Date(reserva.fecha_hora_salida);
            const opcionesFecha = { day: '2-digit', month: 'short', year: 'numeric' };
            const fechaStr = fechaObj.toLocaleDateString('es-ES', opcionesFecha).replace('.', '');

            tr.innerHTML = `
                <td><span class="pnr-code">#RES-${reserva.id_reserva.toString().padStart(3, '0')}</span></td>
                <td>
                    <div class="pasajero-info">
                        <span class="nombre">${reserva.nombre_completo}</span>
                    </div>
                </td>
                <td>${reserva.cod_vuelo} | ${reserva.origen} → ${reserva.destino}</td>
                <td>${fechaStr}</td>
                <td><span class="estado ${estadoClase}" role="status">${reserva.estado}</span></td>
                <td><a href="detalle-reserva.html?id=${reserva.id_reserva}" class="btn-accion">Gestionar</a></td>
            `;
            tbody.appendChild(tr);
        });

        renderCanceladasRecientes(canceladasRecientes);

    } catch (error) {
        console.error('Error cargando el dashboard del agente:', error);
        if (typeof window.mostrarBannerError === 'function') {
            window.mostrarBannerError(error);
        }
    }
}

function renderCanceladasRecientes(canceladas = []) {
    const tbody = document.getElementById('tbody-canceladas-recientes');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!canceladas.length) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay reservas canceladas recientes</td></tr>`;
        return;
    }

    canceladas.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#RES-${item.id_reserva.toString().padStart(3, '0')}</td>
            <td>${item.cliente}</td>
            <td>${item.destino}</td>
            <td>${item.causa || 'Sin causa registrada'}</td>
        `;
        tbody.appendChild(tr);
    });
}
