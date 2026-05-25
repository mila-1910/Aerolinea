/* ============================================
   JAVASCRIPT ESPECÍFICO - DASHBOARD AGENTE
   Scripts únicos para dashboardeagente.html
   ============================================ */

document.addEventListener('DOMContentLoaded', async function() {
    await cargarDatosDashboard();
});

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        cargarDatosDashboard();
    }
});

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
        const recientes = Array.isArray(data.recientes) ? data.recientes : [];

        // Actualizar KPIs
        document.getElementById('kpi-pendientes').textContent = pendientes < 10 ? `0${pendientes}` : pendientes;
        document.getElementById('kpi-confirmadas').textContent = confirmadas < 10 ? `0${confirmadas}` : confirmadas;
        document.getElementById('kpi-canceladas').textContent = canceladas < 10 ? `0${canceladas}` : canceladas;

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

    } catch (error) {
        console.error('Error cargando el dashboard del agente:', error);
        if (typeof window.mostrarBannerError === 'function') {
            window.mostrarBannerError(error);
        }
    }
}
