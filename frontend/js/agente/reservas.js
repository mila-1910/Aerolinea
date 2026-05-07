/* ============================================
   JAVASCRIPT ESPECÍFICO - GESTIÓN DE RESERVAS
   Scripts únicos para reservas.html
   ============================================ */

// Función para buscar reservas
function buscarReservas() {
    const cliente = document.getElementById('buscarCliente')?.value || '';
    const vuelo = document.getElementById('buscarVuelo')?.value || '';
    
    console.log('Buscando reservas:', { cliente, vuelo });
    // Aquí va la lógica de búsqueda
}

// Función para limpiar filtros
function limpiarFiltros() {
    if (document.getElementById('buscarCliente')) {
        document.getElementById('buscarCliente').value = '';
    }
    if (document.getElementById('buscarVuelo')) {
        document.getElementById('buscarVuelo').value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const btnBuscar = document.querySelector('.btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarReservas);
    }

    const btnLimpiar = document.querySelector('.btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFiltros);
    }
});
