/* ============================================
   JAVASCRIPT ESPECÍFICO - CONFIRMAR PAGO
   Scripts únicos para confirmar-pago.html
   ============================================ */

// Función para confirmar pago
function confirmarPago() {
    const observacion = document.querySelector('.observacion-pago textarea')?.value || '';
    console.log('Confirmando pago con observación:', observacion);
    // Aquí va la lógica para procesar el pago
}

// Función para rechazar pago
function rechazarPago() {
    const observacion = document.querySelector('.observacion-pago textarea')?.value || '';
    console.log('Rechazando pago con observación:', observacion);
    // Aquí va la lógica para rechazar el pago
}

document.addEventListener('DOMContentLoaded', function() {
    const btnConfirmarPago = document.querySelector('.btn-confirmar-pago');
    if (btnConfirmarPago) {
        btnConfirmarPago.addEventListener('click', confirmarPago);
    }

    const btnRechazarPago = document.querySelector('.btn-rechazar-pago');
    if (btnRechazarPago) {
        btnRechazarPago.addEventListener('click', rechazarPago);
    }
});
