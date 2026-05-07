/* ============================================
   JAVASCRIPT ESPECÍFICO - DETALLE RESERVA
   Scripts únicos para detalle-reserva.html
   ============================================ */

// Base de datos simulada (para pruebas)
const reservasSimuladas = {
    1: {
        codigo: "#RES-001",
        pasajero: {
            nombre: "María González",
            documento: "1002433789",
            nacionalidad: "Colombiana",
            fechaNac: "15/08/1990",
            email: "maria.gonzalez@email.com",
            telefono: "+57 310 123 4567"
        },
        vuelo: {
            codigo: "AV-1234",
            origen: "Bogotá (BOG)",
            destino: "Medellín (MDE)",
            fechaSalida: "15/04/2026",
            horaSalida: "10:30 AM",
            horaLlegada: "11:45 AM",
            clase: "Económica",
            asiento: "12A"
        },
        pago: {
            estado: "Pendiente",
            metodo: "Tarjeta de crédito",
            montoTotal: "$250 USD",
            precioBase: "$200 USD",
            paquetes: "$50 USD"
        },
        estadoReserva: {
            actual: "Pendiente",
            fechaReserva: "10/04/2026 - 14:23:15",
            ultimaModificacion: "11/04/2026 - 09:30:00"
        },
        historial: [
            { fecha: "10/04/2026", hora: "14:23:15", anterior: "-", nuevo: "Reservada", agente: "Cliente" },
            { fecha: "10/04/2026", hora: "14:23:15", anterior: "Reservada", nuevo: "Pendiente de pago", agente: "Cliente" },
            { fecha: "11/04/2026", hora: "09:30:00", anterior: "Pendiente de pago", nuevo: "Pendiente", agente: "Agente (Juan Fernando)" },
            { fecha: "12/04/2026", hora: "15:20:00", anterior: "Pendiente", nuevo: "En proceso", agente: "Sistema" }
        ]
    },
    2: {
        codigo: "#RES-002",
        pasajero: {
            nombre: "Carlos Rodríguez",
            documento: "87654321",
            nacionalidad: "Colombiana",
            fechaNac: "22/03/1985",
            email: "carlos.rodriguez@email.com",
            telefono: "+57 311 987 6543"
        },
        vuelo: {
            codigo: "AV-5678",
            origen: "Medellín (MDE)",
            destino: "Cartagena (CTG)",
            fechaSalida: "16/04/2026",
            horaSalida: "08:00 AM",
            horaLlegada: "09:15 AM",
            clase: "Ejecutiva",
            asiento: "4B"
        },
        pago: {
            estado: "Confirmado",
            metodo: "Tarjeta débito",
            montoTotal: "$320 USD",
            precioBase: "$280 USD",
            paquetes: "$40 USD"
        },
        estadoReserva: {
            actual: "Confirmada",
            fechaReserva: "05/04/2026 - 10:30:00",
            ultimaModificacion: "06/04/2026 - 14:20:00"
        },
        historial: [
            { fecha: "05/04/2026", hora: "10:30:00", anterior: "-", nuevo: "Reservada", agente: "Cliente" },
            { fecha: "05/04/2026", hora: "10:35:00", anterior: "Reservada", nuevo: "Pendiente de pago", agente: "Cliente" },
            { fecha: "06/04/2026", hora: "14:20:00", anterior: "Pendiente de pago", nuevo: "Confirmada", agente: "Agente" }
        ]
    },
    3: {
        codigo: "#RES-003",
        pasajero: {
            nombre: "Ana Martínez",
            documento: "11223344",
            nacionalidad: "Colombiana",
            fechaNac: "10/12/1992",
            email: "ana.martinez@email.com",
            telefono: "+57 312 456 7890"
        },
        vuelo: {
            codigo: "AV-9012",
            origen: "Cali (CLO)",
            destino: "Bogotá (BOG)",
            fechaSalida: "17/04/2026",
            horaSalida: "18:30 PM",
            horaLlegada: "19:45 PM",
            clase: "Económica",
            asiento: "22C"
        },
        pago: {
            estado: "Pendiente",
            metodo: "Efectivo (punto de venta)",
            montoTotal: "$180 USD",
            precioBase: "$150 USD",
            paquetes: "$30 USD"
        },
        estadoReserva: {
            actual: "Pendiente",
            fechaReserva: "12/04/2026 - 09:15:00",
            ultimaModificacion: "12/04/2026 - 09:20:00"
        },
        historial: [
            { fecha: "12/04/2026", hora: "09:15:00", anterior: "-", nuevo: "Reservada", agente: "Cliente" },
            { fecha: "12/04/2026", hora: "09:20:00", anterior: "Reservada", nuevo: "Pendiente", agente: "Cliente" }
        ]
    }
};

// Cargar datos de la reserva
function cargarReserva(data) {
    document.getElementById('codigoReserva').innerText = data.codigo;
    document.getElementById('nombrePasajero').innerText = data.pasajero.nombre;
    document.getElementById('documentoPasajero').innerText = data.pasajero.documento;
    document.getElementById('nacionalidad').innerText = data.pasajero.nacionalidad;
    document.getElementById('fechaNac').innerText = data.pasajero.fechaNac;
    document.getElementById('email').innerText = data.pasajero.email;
    document.getElementById('telefono').innerText = data.pasajero.telefono;

    document.getElementById('codigoVuelo').innerText = data.vuelo.codigo;
    document.getElementById('origen').innerText = data.vuelo.origen;
    document.getElementById('destino').innerText = data.vuelo.destino;
    document.getElementById('fechaSalida').innerText = data.vuelo.fechaSalida;
    document.getElementById('horaSalida').innerText = data.vuelo.horaSalida;
    document.getElementById('horaLlegada').innerText = data.vuelo.horaLlegada;
    document.getElementById('clase').innerText = data.vuelo.clase;
    document.getElementById('asiento').innerText = data.vuelo.asiento;

    const estadoPagoSpan = document.getElementById('estadoPagoBadge');
    estadoPagoSpan.innerText = data.pago.estado;
    estadoPagoSpan.className = `estado-pago-badge ${data.pago.estado === 'Pendiente' ? 'pendiente' : 'confirmado'}`;
    document.getElementById('metodoPago').innerText = data.pago.metodo;
    document.getElementById('montoTotal').innerText = data.pago.montoTotal;
    document.getElementById('precioBase').innerText = data.pago.precioBase;
    document.getElementById('paquetes').innerText = data.pago.paquetes;

    const estadoReservaSpan = document.getElementById('estadoReservaBadge');
    estadoReservaSpan.innerText = data.estadoReserva.actual;
    estadoReservaSpan.className = `estado ${data.estadoReserva.actual === 'Pendiente' ? 'pendiente' : (data.estadoReserva.actual === 'Confirmada' ? 'confirmada' : 'cancelada')}`;
    document.getElementById('fechaReserva').innerText = data.estadoReserva.fechaReserva;
    document.getElementById('ultimaModificacion').innerText = data.estadoReserva.ultimaModificacion;

    const tbody = document.getElementById('historialBody');
    tbody.innerHTML = '';
    data.historial.forEach(item => {
        const row = `<tr>
            <td>${item.fecha}</td>
            <td>${item.hora}</td>
            <td>${item.anterior}</td>
            <td>${item.nuevo}</td>
            <td>${item.agente}</td>
        </tr>`;
        tbody.innerHTML += row;
    });

    const btnConfirmar = document.getElementById('btnConfirmarPago');
    const btnAsignar = document.getElementById('btnAsignarAsiento');
    if (btnConfirmar) btnConfirmar.href = `confirmar-pago.html?id=${urlParams.get('id')}`;
    if (btnAsignar) btnAsignar.href = `asignar-asiento.html?id=${urlParams.get('id')}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if (!id) id = '1';

    const reserva = reservasSimuladas[id];
    if (!reserva) {
        alert(`No se encontró la reserva con ID ${id}. Se mostrarán datos de ejemplo.`);
        cargarReserva(reservasSimuladas[1]);
    } else {
        cargarReserva(reserva);
    }

    document.getElementById('btnRechazarPago')?.addEventListener('click', () => {
        if (confirm('¿Rechazar el pago de esta reserva?')) {
            alert('Pago rechazado (simulado). Actualice la página para ver cambios.');
        }
    });

    document.getElementById('btnCancelarReserva')?.addEventListener('click', () => {
        if (confirm('¿Cancelar esta reserva? Esta acción no se puede deshacer.')) {
            alert(`Reserva ${document.getElementById('codigoReserva').innerText} cancelada (simulado).`);
        }
    });
});
