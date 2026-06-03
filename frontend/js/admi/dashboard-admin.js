function actualizarGraficosResumen(data) {
    const charts = window.dashboardCharts;

    if (!charts) {
        return;
    }

    const resumen = [
        Number(data.totalVuelos ?? 0),
        Number(data.totalPaquetes ?? 0),
        Number(data.totalDestinos ?? 0),
        Number(data.totalReservas ?? 0)
    ];

    charts.barras.data.datasets[0].data = resumen;
    charts.barras.update();

    charts.torta.data.datasets[0].data = resumen;
    charts.torta.update();
}

function renderizarUltimasReservas(reservas = []) {
    const tbody = document.getElementById('tablaReservasBody');

    if (!tbody) {
        return;
    }

    tbody.innerHTML = '';

    if (!reservas.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3">No hay reservas registradas aún.</td>
            </tr>
        `;
        return;
    }

    reservas.forEach(reserva => {
        const fila = `
            <tr>
                <td>${reserva.numero_reserva}</td>
                <td>${reserva.nombre_completo}</td>
                <td>${reserva.estado}</td>
            </tr>
        `;

        tbody.innerHTML += fila;
    });
}

function renderClientesFrecuentes(clientes = []) {
    const tbody = document.getElementById('tablaClientesFrecuentes');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!clientes.length) {
        tbody.innerHTML = `
            <tr><td colspan="2">No hay datos de clientes frecuentes.</td></tr>
        `;
        return;
    }

    clientes.forEach(cliente => {
        const fila = `
            <tr>
                <td>${cliente.cliente}</td>
                <td>${cliente.total_reservas}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

function renderReservasCanceladas(canceladas = []) {
    const tbody = document.getElementById('tablaReservasCanceladas');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!canceladas.length) {
        tbody.innerHTML = `
            <tr><td colspan="3">No hay reservas canceladas recientes.</td></tr>
        `;
        return;
    }

    canceladas.forEach(item => {
        const fila = `
            <tr>
                <td>#RES-${item.id_reserva.toString().padStart(3, '0')}</td>
                <td>${item.destino}</td>
                <td>${item.causa || 'Sin causa registrada'}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const respuesta = await fetch('http://localhost:3000/api/admin/dashboard');

        if (!respuesta.ok) {
            throw new Error(`Error al obtener dashboard: ${respuesta.status}`);
        }

        const data = await respuesta.json();

        document.getElementById('totalVuelos').textContent = data.totalVuelos ?? 0;
        document.getElementById('totalReservas').textContent = data.totalReservas ?? 0;
        document.getElementById('totalDestinos').textContent = data.totalDestinos ?? 0;

        const elTotalPaquetes = document.getElementById('totalPaquetes');
        if (elTotalPaquetes) {
            elTotalPaquetes.textContent = data.totalPaquetes ?? 0;
        }

        document.getElementById('avgConfirmacion').textContent =
            data.tiempoPromedioConfirmacionMinutos > 0
                ? `${data.tiempoPromedioConfirmacionMinutos} min`
                : 'N/A';

        actualizarGraficosResumen(data);
        renderizarUltimasReservas(data.ultimasReservas || []);
        renderClientesFrecuentes(data.clientesFrecuentes || []);
        renderReservasCanceladas(data.reservasCanceladas || []);
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
});