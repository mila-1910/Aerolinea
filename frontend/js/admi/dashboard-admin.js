document.addEventListener("DOMContentLoaded", async () => {

    const respuesta = await fetch("http://localhost:3000/api/admin/dashboard");
    const data = await respuesta.json();

    document.getElementById("totalVuelos").textContent = data.totalVuelos;
    document.getElementById("totalReservas").textContent = data.totalReservas;
    document.getElementById("totalDestinos").textContent = data.totalDestinos;

    let html = "";

    data.ultimasReservas.forEach(r => {
        html += `
        <tr>
            <td><span class="reserva-id">${r.numero_reserva}</span></td>
            <td>${r.nombre_completo}</td>
            <td><span class="badge-estado">${r.estado}</span></td>
        </tr>
        `;
    });

    document.getElementById("tablaReservas").innerHTML = html;
});