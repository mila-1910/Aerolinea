/* ============================================
   JAVASCRIPT COMÚN - MÓDULO AGENTE
   Funcionalidad compartida para todas las páginas
   ============================================ */

// Inicializar dropdown del perfil
function initPerfilDropdown() {
    const perfilDropdown = document.getElementById('perfilDropdown');
    const perfilMenu = document.getElementById('perfilMenu');

    if (!perfilDropdown || !perfilMenu) return;

    // Al hacer clic en el área del perfil, alternar el menú
    perfilDropdown.addEventListener('click', function (event) {
        event.stopPropagation();
        perfilMenu.classList.toggle('show');
    });

    // Si se hace clic fuera del área del perfil, cerrar el menú
    document.addEventListener('click', function (event) {
        if (!perfilDropdown.contains(event.target)) {
            perfilMenu.classList.remove('show');
        }
    });
}

// Verificar rol del usuario
function verificarRolUsuario() {
    const u = JSON.parse(localStorage.getItem('usuario'));
    if (!u || (u.rol !== 'agente' && u.rol !== 'admin')) {
        window.location.href = '../inicio/login.html';
    }
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    initPerfilDropdown();
    verificarRolUsuario();
    initCerrarSesion();
});

function initCerrarSesion() {
    const logoutLinks = document.querySelectorAll('.cerrar-sesion, .cerrar-sesion-sidebar');
    const loginUrl = '../inicio/login.html';

    logoutLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('usuario');
            window.location.href = loginUrl;
        });
    });
}

