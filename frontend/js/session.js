document.addEventListener('DOMContentLoaded', () => {
    // 1. Buscamos al usuario en la memoria del navegador
    const usuarioRaw = localStorage.getItem('usuario');

    // Si NO hay sesión y NO estamos en páginas de inicio/registro, redirigir al login (opcional, pero buena práctica)
    if (!usuarioRaw && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html') && !window.location.pathname.includes('index.html')) {
        // window.location.href = '../inicio/login.html'; // Descomenta esto para forzar login
    }

    if (usuarioRaw) {
        // 2. Convertimos el texto en un objeto real
        const usuario = JSON.parse(usuarioRaw);

        // ---- CONTROL DE ACCESO (RBAC) ----
        const currentPath = window.location.pathname;
        const rol = usuario.rol;

        const redirigirSegunRol = (rolUsuario) => {
            if (rolUsuario === 'Super Administrador' || rolUsuario === 'Administrador') {
                window.location.href = '../admin/dashboardadmin.html';
            } else if (rolUsuario === 'Agente' || rolUsuario === 'Agente de Aerolínea') {
                window.location.href = '../agente/dashboardeagente.html';
            } else {
                window.location.href = '../inicio/index.html';
            }
        };

        // 1. Validar acceso a la zona de Clientes
        if (currentPath.includes('/paginas/cliente/')) {
            if (rol !== 'Cliente' && rol !== 'cliente') {
                alert('Acceso restringido: Las funciones de reserva y compra son exclusivas para Clientes. Serás redirigido a tu panel correspondiente.');
                redirigirSegunRol(rol);
                return;
            }
        }
        // 2. Validar acceso a la zona de Administradores
        else if (currentPath.includes('/paginas/admin/')) {
            if (rol !== 'Super Administrador' && rol !== 'Administrador') {
                alert('Acceso restringido: Esta zona es exclusiva para personal Administrador.');
                redirigirSegunRol(rol);
                return;
            }
        }
        // 3. Validar acceso a la zona de Agentes
        else if (currentPath.includes('/paginas/agente/')) {
            if (rol !== 'Agente' && rol !== 'Agente de Aerolínea') {
                alert('Acceso restringido: Esta zona es exclusiva para Agentes de la aerolínea.');
                redirigirSegunRol(rol);
                return;
            }
        }
        // ----------------------------------

        // 3. Reemplazamos los datos en el HTML
        const nombreDisplay = document.getElementById('user-display-name');
        const inicialDisplay = document.getElementById('user-initial');

        if (nombreDisplay) {
            nombreDisplay.textContent = usuario.nombre_completo;
        }

        if (inicialDisplay) {
            inicialDisplay.textContent = usuario.nombre_completo.charAt(0).toUpperCase();
        }
    }

    // 4. Manejo del Cierre de Sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar redirección inmediata si necesitamos hacer algo más
            // Borramos la memoria para que no se quede el nombre guardado
            localStorage.removeItem('usuario');
            
            // Redirigimos a la página de login
            window.location.href = '../inicio/login.html';
        });
    }
});
