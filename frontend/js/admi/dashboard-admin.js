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

        actualizarGraficosResumen(data);
        renderizarUltimasReservas(data.ultimasReservas || []);
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
});