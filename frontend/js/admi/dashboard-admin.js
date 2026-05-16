document.addEventListener('DOMContentLoaded', async () => {

    try {

        const respuesta = await fetch('http://localhost:3000/api/admin/dashboard');

        const data = await respuesta.json();

        // KPIs
        document.getElementById('totalVuelos').textContent =
            data.totalVuelos;

        document.getElementById('totalReservas').textContent =
            data.totalReservas;

        document.getElementById('totalDestinos').textContent =
            data.totalDestinos;

        // TABLA RESERVAS
        const tbody = document.getElementById('tablaReservasBody');

        tbody.innerHTML = '';

        data.ultimasReservas.forEach(reserva => {

            const fila = `
                <tr>
                    <td>${reserva.numero_reserva}</td>
                    <td>${reserva.nombre_completo}</td>
                    <td>${reserva.estado}</td>
                </tr>
            `;

            tbody.innerHTML += fila;
        });

    } catch (error) {

        console.error('Error cargando dashboard:', error);

    }

});