/* ============================================
   JAVASCRIPT COMÚN - MÓDULO ADMINISTRADOR
   Funcionalidad compartida para todas las páginas de admin
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    verificarSesionAdmin();
    actualizarPerfilAdmin();
    initCerrarSesionAdmin();
});

function verificarSesionAdmin() {
    const u = JSON.parse(localStorage.getItem('usuario'));
    const rol = u && u.rol ? u.rol.toLowerCase().trim() : '';

    const rolesAdmin = ['administrador', 'admin', 'super administrador'];

    if (!u) {
        window.location.href = '../../paginas/inicio/login.html';
        return;
    }

    if (!rolesAdmin.includes(rol)) {
        alert('Acceso restringido: Esta zona es exclusiva para Administradores.');
        if (rol === 'agente' || rol === 'agente de aerolínea' || rol === 'agente de aerolinea') {
            window.location.href = '../../paginas/agente/dashboardeagente.html';
        } else if (rol === 'cliente') {
            window.location.href = '../../paginas/cliente/buscar-vuelos.html';
        } else {
            window.location.href = '../../paginas/inicio/index.html';
        }
    }
}

// 2. Actualizar el nombre e iniciales en el Navbar
function actualizarPerfilAdmin() {
    const u = JSON.parse(localStorage.getItem('usuario'));
    if (!u || !u.nombre_completo) return;

    const nombre = u.nombre_completo;
    // Obtener iniciales (ej: "Kamila Marin" -> "KM")
    const iniciales = nombre.split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    // Seleccionamos los elementos del navbar
    const navbarNombre = document.querySelector('.navbar-perfil .perfil-trigger span');
    const navbarAvatar = document.querySelector('.navbar-perfil .avatar');

    if (navbarNombre) navbarNombre.textContent = nombre;
    if (navbarAvatar) navbarAvatar.textContent = iniciales;

    // Actualizar saludo en el Dashboard si existe
    const saludoH2 = document.querySelector('.saludo h2');
    if (saludoH2 && saludoH2.textContent.toLowerCase().includes('hola')) {
        saludoH2.innerHTML = `<i class="fas fa-crown"></i> ¡Hola, ${nombre}!`;
    }
}

// 3. Inicializar el botón de Cerrar Sesión
function initCerrarSesionAdmin() {
    const logoutLinks = document.querySelectorAll('.cerrar-sesion');

    logoutLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('usuario');
            window.location.href = '../../paginas/inicio/login.html';
        });
    });
}
