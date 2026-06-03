/* ============================================
   JAVASCRIPT ESPECÍFICO - REPORTES AGENTE
   ============================================ */

let datosReportes = null;

document.addEventListener('DOMContentLoaded', async function() {
    await cargarReportes();
    configurarBuscadorHistorial();
});

async function cargarReportes() {
    try {
        const response = await fetch(`${window.API_BASE || ''}/api/agente/reportes`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        datosReportes = await response.json();
        
        renderIngresosPorDestino(datosReportes.ingresosPorDestino);
        renderReservasPorVuelo(datosReportes.reservasPorVuelo);
        renderClientesFrecuentes(datosReportes.clientesFrecuentes);
        renderVuelosGeografia(datosReportes.vuelosPorGeografia);
        renderDestinosMasVendidos(datosReportes.destinosMasVendidos);
        renderCanceladasCausas(datosReportes.canceladasConCausa);
        
        // El historial lo renderizamos vacío inicialmente o con un mensaje
        document.getElementById('timeline-historial').innerHTML = `
            <div style="padding: 20px; color: #94A3B8; text-align:center;">
                Ingrese el número de documento de un cliente para ver su historial.
            </div>
        `;
        
    } catch (error) {
        console.error('Error cargando reportes:', error);
        if (typeof window.mostrarBannerError === 'function') {
            window.mostrarBannerError(error);
        }
    }
}

function renderIngresosPorDestino(data) {
    const container = document.getElementById('chart-ingresos-destino');
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#94A3B8;">No hay datos de ingresos.</div>';
        return;
    }
    
    // Obtener el máximo para calcular los porcentajes de la barra
    const maxIngreso = Math.max(...data.map(d => parseFloat(d.ingresos)));
    
    let html = '';
    data.slice(0, 5).forEach((item, index) => {
        const valor = parseFloat(item.ingresos);
        const porcentaje = maxIngreso > 0 ? (valor / maxIngreso) * 100 : 0;
        
        // Formatear a moneda colombiana (COP) aprox
        const valorFormat = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
        
        html += `
            <div class="bar-row animate-fade-in delay-${index+1}">
                <div class="bar-labels">
                    <span class="bar-label-name">${item.destino}</span>
                    <span class="bar-label-value">${valorFormat}</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: 0%" data-target="${porcentaje}%"></div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Animar las barras después de un pequeño delay
    setTimeout(() => {
        const barras = container.querySelectorAll('.bar-fill');
        barras.forEach(barra => {
            barra.style.width = barra.getAttribute('data-target');
        });
    }, 100);
}

function renderReservasPorVuelo(data) {
    const tbody = document.getElementById('tbody-reservas-vuelo');
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay datos</td></tr>';
        return;
    }
    
    let html = '';
    data.slice(0, 10).forEach(item => {
        html += `
            <tr>
                <td><span class="badge-vuelo">${item.cod_vuelo}</span></td>
                <td>${item.mes}</td>
                <td><strong>${item.total_reservas}</strong></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderClientesFrecuentes(data) {
    const container = document.getElementById('list-clientes-frecuentes');
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#94A3B8;">No hay clientes registrados con reservas.</div>';
        return;
    }
    
    let html = '';
    data.slice(0, 5).forEach((item, index) => {
        let medalClass = 'medal-other';
        let medalIcon = `${index + 1}`;
        
        if (index === 0) { medalClass = 'medal-1'; medalIcon = '<i class="fas fa-trophy"></i>'; }
        else if (index === 1) { medalClass = 'medal-2'; medalIcon = '<i class="fas fa-medal"></i>'; }
        else if (index === 2) { medalClass = 'medal-3'; medalIcon = '<i class="fas fa-award"></i>'; }
        
        html += `
            <div class="ranking-item animate-fade-in delay-${index+1}">
                <div class="ranking-medal ${medalClass}">${medalIcon}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${item.cliente}</div>
                    <div class="ranking-doc">Doc: ${item.numero_identificacion}</div>
                </div>
                <div class="ranking-score">${item.total_reservas} <span style="font-size:0.7rem; font-weight:normal; color:#666;">res.</span></div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderVuelosGeografia(data) {
    const tbody = document.getElementById('tbody-geografia');
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay vuelos registrados</td></tr>';
        return;
    }
    
    let html = '';
    data.forEach(item => {
        const precioFormat = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.precio_base);
        
        html += `
            <tr>
                <td><span class="badge-vuelo">${item.cod_vuelo}</span><br><span style="font-size:0.75rem;color:#666;">${item.estado_vuelo}</span></td>
                <td>
                    <strong style="color:var(--vino);">${item.origen_pais}</strong><br>
                    <span style="font-size:0.8rem">${item.origen_departamento}</span><br>
                    <span style="font-size:0.85rem; font-weight:600;">${item.origen_ciudad}</span>
                </td>
                <td>
                    <strong style="color:var(--exito);">${item.destino_pais}</strong><br>
                    <span style="font-size:0.8rem">${item.destino_departamento}</span><br>
                    <span style="font-size:0.85rem; font-weight:600;">${item.destino_ciudad}</span>
                </td>
                <td style="font-weight:700;">${precioFormat}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderDestinosMasVendidos(data) {
    const tbody = document.getElementById('tbody-destinos-vendidos');
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay destinos vendidos</td></tr>';
        return;
    }
    
    let html = '';
    data.slice(0, 8).forEach(item => {
        const ingresosFormat = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.ingresos);
        html += `
            <tr>
                <td><strong style="color:#333;">${item.pais}</strong></td>
                <td>${item.departamento}</td>
                <td><strong style="color:var(--vino);">${item.destino}</strong></td>
                <td><span style="background:rgba(212,175,55,0.2); color:#856404; padding:4px 8px; border-radius:6px; font-weight:700;">${item.total_reservas}</span></td>
                <td style="font-weight:700; color:#10b981;">${ingresosFormat}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderCanceladasCausas(data) {
    const tbody = document.getElementById('tbody-canceladas-causas');
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay cancelaciones recientes</td></tr>';
        return;
    }
    
    let html = '';
    data.slice(0, 10).forEach(item => {
        const causaText = item.causa ? item.causa : '<span style="color:#94A3B8; font-style:italic;">No especificada</span>';
        html += `
            <tr>
                <td><strong>#RES-${item.id_reserva.toString().padStart(3, '0')}</strong><br><span style="font-size:0.8rem">${item.cliente}</span></td>
                <td><span class="badge-vuelo">${item.cod_vuelo}</span><br><span style="font-size:0.8rem">Dest: ${item.destino}</span></td>
                <td>${causaText}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function configurarBuscadorHistorial() {
    const btn = document.getElementById('btn-buscar-historial');
    const input = document.getElementById('input-buscar-historial');
    
    const buscar = () => {
        const doc = input.value.trim();
        if (!doc) {
            alert('Ingrese un documento para buscar');
            return;
        }
        
        if (!datosReportes || !datosReportes.historialClientes) return;
        
        const historialFiltrado = datosReportes.historialClientes.filter(h => h.numero_identificacion === doc);
        renderHistorialCliente(historialFiltrado, doc);
    };
    
    btn.addEventListener('click', buscar);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscar();
    });
}

function renderHistorialCliente(data, docBuscado) {
    const timeline = document.getElementById('timeline-historial');
    
    if (!data || data.length === 0) {
        timeline.innerHTML = `<div style="padding: 20px; color: var(--error); text-align:center; font-weight:600;"><i class="fas fa-exclamation-circle"></i> No se encontró historial para el documento: ${docBuscado}</div>`;
        return;
    }
    
    // Agrupar por id_reserva para no mezclar eventos de reservas diferentes
    const reservasMap = new Map();
    data.forEach(item => {
        if (!reservasMap.has(item.id_reserva)) {
            reservasMap.set(item.id_reserva, []);
        }
        reservasMap.get(item.id_reserva).push(item);
    });
    
    const nombreCliente = data[0].cliente;
    let html = `<div style="margin-bottom: 20px; font-weight:700; color:var(--vino);">Cliente: ${nombreCliente}</div>`;
    
    reservasMap.forEach((eventos, idReserva) => {
        html += `<div style="margin-bottom: 10px; font-weight:600; font-size:0.9rem; color:#666; background:#eee; padding:5px 10px; border-radius:6px; display:inline-block;">Reserva #RES-${idReserva.toString().padStart(3, '0')}</div>`;
        
        eventos.forEach(evt => {
            const dateObj = new Date(evt.fecha_hora_cambio);
            const dateStr = dateObj.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
            
            let dotClass = '';
            if (evt.nombre_estado_historial === 'Cancelada') dotClass = 'cancelado';
            else if (evt.nombre_estado_historial === 'Confirmada') dotClass = 'confirmado';
            
            const obs = evt.observacion ? `<div class="timeline-desc"><strong>Obs:</strong> ${evt.observacion}</div>` : '';
            const resp = evt.responsable ? `<div class="timeline-desc" style="font-size:0.75rem; color:#999;">Por: ${evt.responsable}</div>` : '';
            
            html += `
                <div class="timeline-item animate-fade-in">
                    <div class="timeline-dot ${dotClass}"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${dateStr}</div>
                        <div class="timeline-title">Cambio a estado: <span style="color:var(--vino);">${evt.nombre_estado_historial}</span></div>
                        ${obs}
                        ${resp}
                    </div>
                </div>
            `;
        });
        html += '<div style="height:20px;"></div>';
    });
    
    timeline.innerHTML = html;
}
