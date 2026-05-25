/* ============================================
   JAVASCRIPT ESPECÍFICO - GESTIÓN DE RESERVAS
   Scripts únicos para reservas.html
   ============================================ */

let todasLasReservas = [];
let filtroEstadoActual = 'todos';

// Formatear moneda COP
function formatCOP(valor) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}

// Formatear fecha
function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones).replace('.', '');
}

// Obtener clase CSS según estado
function getEstadoClase(estado) {
    const e = estado.toLowerCase();
    if (e === 'confirmada') return 'confirmada';
    if (e === 'cancelada') return 'cancelada';
    if (e === 'expirada') return 'cancelada';
    return 'pendiente'; // Reservada u otros
}

// Obtener ícono según estado
function getEstadoIcono(estado) {
    const e = estado.toLowerCase();
    if (e === 'confirmada') return 'fa-check-circle';
    if (e === 'cancelada') return 'fa-times-circle';
    if (e === 'expirada') return 'fa-hourglass-end';
    return 'fa-clock';
}

// Renderizar tabla con array de reservas
function renderizarTabla(reservas) {
    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = '';

    if (reservas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--gris-subtle);">
            <i class="fas fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
            No se encontraron reservas
        </td></tr>`;
        document.getElementById('totalRegistros').textContent = 'Sin resultados';
        return;
    }

    reservas.forEach(r => {
        const tr = document.createElement('tr');
        const estadoClase = getEstadoClase(r.estado);
        const estadoIcono = getEstadoIcono(r.estado);

        tr.innerHTML = `
            <td>#RES-${r.id_reserva.toString().padStart(3, '0')}</td>
            <td>
                <div style="font-weight: 700;">${r.nombre_completo}</div>
                <div style="font-size: 0.75rem; color: var(--gris-subtle);">${r.numero_identificacion}</div>
            </td>
            <td>${r.cod_vuelo}</td>
            <td>${r.origen} <i class="fas fa-arrow-right" style="font-size: 0.7rem; margin: 0 5px;"></i> ${r.destino}</td>
            <td>${formatFecha(r.fecha_hora_reserva)}</td>
            <td style="font-weight: 700;">${formatCOP(r.valor_total)}</td>
            <td><span class="estado ${estadoClase}"><i class="fas ${estadoIcono}"></i> ${r.estado}</span></td>
            <td><a href="detalle-reserva.html?id=${r.id_reserva}" class="btn-accion">Gestionar</a></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('totalRegistros').textContent = `Mostrando ${reservas.length} de ${todasLasReservas.length} registros`;
}

// Actualizar contadores de stats y filtros
function actualizarContadores() {
    const total = todasLasReservas.length;
    const reservadas = todasLasReservas.filter(r => r.estado === 'Reservada').length;
    const confirmadas = todasLasReservas.filter(r => r.estado === 'Confirmada').length;
    const canceladas = todasLasReservas.filter(r => r.estado === 'Cancelada').length;
    const expiradas = todasLasReservas.filter(r => r.estado === 'Expirada').length;

    // Stats mini cards
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pendientes').textContent = reservadas;
    document.getElementById('stat-confirmadas').textContent = confirmadas;
    document.getElementById('stat-canceladas').textContent = canceladas;

    // Filtro badges
    document.getElementById('filtro-todos').textContent = total;
    document.getElementById('filtro-reservadas').textContent = reservadas;
    document.getElementById('filtro-confirmadas').textContent = confirmadas;
    document.getElementById('filtro-canceladas').textContent = canceladas;
    document.getElementById('filtro-expiradas').textContent = expiradas;
}

// Aplicar filtros combinados
function aplicarFiltros() {
    const textoCliente = (document.getElementById('buscarCliente')?.value || '').toLowerCase().trim();
    const textoVuelo = (document.getElementById('buscarVuelo')?.value || '').toLowerCase().trim();
    const textoFecha = document.getElementById('buscarFecha')?.value || '';

    let filtradas = [...todasLasReservas];

    // Filtro por estado (botones rápidos)
    if (filtroEstadoActual !== 'todos') {
        filtradas = filtradas.filter(r => r.estado === filtroEstadoActual);
    }

    // Filtro por cliente / documento
    if (textoCliente) {
        filtradas = filtradas.filter(r =>
            r.nombre_completo.toLowerCase().includes(textoCliente) ||
            r.numero_identificacion.toLowerCase().includes(textoCliente)
        );
    }

    // Filtro por código de vuelo
    if (textoVuelo) {
        filtradas = filtradas.filter(r =>
            r.cod_vuelo.toLowerCase().includes(textoVuelo)
        );
    }

    // Filtro por fecha
    if (textoFecha) {
        filtradas = filtradas.filter(r => {
            const fechaReserva = new Date(r.fecha_hora_reserva).toISOString().split('T')[0];
            return fechaReserva === textoFecha;
        });
    }

    renderizarTabla(filtradas);
}

// Limpiar todos los filtros
function limpiarFiltros() {
    if (document.getElementById('buscarCliente')) document.getElementById('buscarCliente').value = '';
    if (document.getElementById('buscarVuelo')) document.getElementById('buscarVuelo').value = '';
    if (document.getElementById('buscarFecha')) document.getElementById('buscarFecha').value = '';
    filtroEstadoActual = 'todos';

    // Resetear botones de filtro
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
    const btnTodos = document.querySelector('.filtro-btn[data-estado="todos"]');
    if (btnTodos) btnTodos.classList.add('active');

    renderizarTabla(todasLasReservas);
}

// Cargar reservas desde la API
async function cargarReservas() {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reservas`);
        if (!response.ok) throw new Error('Error al obtener reservas');
        todasLasReservas = await response.json();

        actualizarContadores();
        renderizarTabla(todasLasReservas);
    } catch (error) {
        console.error('Error cargando reservas:', error);
        document.getElementById('cuerpoTabla').innerHTML = `
            <tr><td colspan="8" style="text-align: center; padding: 2rem; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
                Error al cargar las reservas. Verifique la conexión al servidor.
            </td></tr>`;
        document.getElementById('totalRegistros').textContent = 'Error de conexión';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    cargarReservas();

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            cargarReservas();
        }
    });

    // Botón Filtrar
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) btnBuscar.addEventListener('click', aplicarFiltros);

    // Botón Limpiar
    const btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFiltros);

    // Filtros rápidos por estado
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroEstadoActual = this.dataset.estado;
            aplicarFiltros();
        });
    });
});
