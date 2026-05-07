/* ============================================
   JAVASCRIPT ESPECÍFICO - ASIGNAR ASIENTO
   Scripts únicos para asignar-asiento.html
   ============================================ */

// Función para buscar reserva
function buscarReserva() {
    const codigo = document.getElementById('codigoReserva')?.value || '';
    console.log('Buscando reserva:', codigo);
    // Aquí va la lógica para buscar la reserva
}

// Función para actualizar mapa de asientos según clase
function actualizarMapaAsientos() {
    const clase = document.getElementById('claseAsiento')?.value || '';
    console.log('Actualizando mapa para clase:', clase);
    // Aquí va la lógica para mostrar asientos según la clase
}

// Función para asignar asiento
function asignarAsiento() {
    const numeroAsiento = document.getElementById('numeroAsiento')?.value || '';
    console.log('Asignando asiento:', numeroAsiento);
    // Aquí va la lógica para asignar el asiento
}

// Función para cancelar asignación
function cancelarAsignacion() {
    document.getElementById('numeroAsiento').value = '';
    document.getElementById('codigoReserva').value = '';
    console.log('Asignación cancelada');
}

document.addEventListener('DOMContentLoaded', function() {
    const btnBuscarReserva = document.querySelector('.btn-buscar-reserva');
    if (btnBuscarReserva) {
        btnBuscarReserva.addEventListener('click', buscarReserva);
    }

    const claseAsiento = document.getElementById('claseAsiento');
    if (claseAsiento) {
        claseAsiento.addEventListener('change', actualizarMapaAsientos);
    }

    const btnAsignarAhora = document.querySelector('.btn-asignar-ahora');
    if (btnAsignarAhora) {
        btnAsignarAhora.addEventListener('click', asignarAsiento);
    }

    const btnCancelarAsignacion = document.querySelector('.btn-cancelar-asignacion');
    if (btnCancelarAsignacion) {
        btnCancelarAsignacion.addEventListener('click', cancelarAsignacion);
    }

    const codigoReserva = document.getElementById('codigoReserva');
    if (codigoReserva) {
        codigoReserva.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                buscarReserva();
            }
        });
    }
});
