document.addEventListener('DOMContentLoaded', () => {
    const cuerpo = document.getElementById('cuerpoTabla');
    const totalRegistros = document.getElementById('totalRegistros');
    const btnNuevo = document.getElementById('btnNuevo');

    async function fetchSolicitudes() {
        try {
            const res = await fetch('/api/agente/solicitudes');
            if (!res.ok) throw new Error('Error al obtener solicitudes');
            const data = await res.json();
            renderTabla(data);
        } catch (err) {
            console.error(err);
            cuerpo.innerHTML = '<tr><td colspan="8">Error al cargar solicitudes</td></tr>';
            totalRegistros.textContent = '0';
        }
    }

    function renderTabla(items) {
        totalRegistros.textContent = items.length + ' solicitudes';
        if (items.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="8">No hay solicitudes</td></tr>';
            return;
        }
        cuerpo.innerHTML = items.map(s => `
            <tr>
                <td>${s.id_solicitud}</td>
                <td>${s.cliente}</td>
                <td>${s.tipo_solicitud}</td>
                <td>${s.prioridad}</td>
                <td>${s.estado}</td>
                <td>${new Date(s.fecha_creacion).toLocaleString()}</td>
                <td>${s.id_reserva || '-'}</td>
                <td>
                    <button class="btn-buscar" data-id="${s.id_solicitud}" onclick="verDetalle(${s.id_solicitud})">Ver</button>
                    <button class="btn-buscar" data-id="${s.id_solicitud}" onclick="responderSolicitud(${s.id_solicitud})">Responder</button>
                </td>
            </tr>
        `).join('');
    }

    // Exponer funciones globales para botones inline
    window.verDetalle = async function(id) {
        try {
            const res = await fetch('/api/agente/solicitudes/' + id);
            if (!res.ok) throw new Error('No se pudo obtener detalle');
            const s = await res.json();
            const detalle = `ID: ${s.id_solicitud}\nCliente: ${s.cliente}\nTipo: ${s.tipo_solicitud}\nEstado: ${s.estado}\nPrioridad: ${s.prioridad}\nDescripcion: ${s.descripcion || '-'}\nRespuesta: ${s.respuesta_agente || '-'}\nFecha creación: ${new Date(s.fecha_creacion).toLocaleString()}`;
            alert(detalle);
        } catch (err) {
            console.error(err);
            alert('Error al cargar detalle');
        }
    }

    window.responderSolicitud = async function(id) {
        const respuesta = prompt('Escribe la respuesta para la solicitud ' + id + ':');
        if (!respuesta) return;
        const nuevoEstado = prompt('Opcional: indicar nuevo estado (Abierta, En proceso, Resuelta, Rechazada) o dejar vacío:');
        try {
            const body = { respuesta, id_agente: null };
            if (nuevoEstado) body.estado = nuevoEstado;
            const res = await fetch('/api/agente/solicitudes/' + id + '/responder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Error al guardar respuesta');
            alert('Respuesta guardada');
            fetchSolicitudes();
        } catch (err) {
            console.error(err);
            alert('Error al guardar respuesta');
        }
    }

    btnNuevo.addEventListener('click', () => {
        // Redirigir a creación rápida de solicitud (puede ser implementado luego)
        const cliente = prompt('Número de identificación del cliente:');
        if (!cliente) return;
        const tipo = prompt('Tipo de solicitud (Cancelación, Cambio de asiento, Consulta de pago, Otro):');
        if (!tipo) return;
        const descripcion = prompt('Descripción:');
        crearSolicitud(cliente, null, tipo, descripcion);
    });

    async function crearSolicitud(numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion) {
        try {
            const res = await fetch('/api/solicitudes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion })
            });
            if (!res.ok) throw new Error('Error al crear solicitud');
            alert('Solicitud creada');
            fetchSolicitudes();
        } catch (err) {
            console.error(err);
            alert('Error al crear solicitud');
        }
    }

    fetchSolicitudes();
});