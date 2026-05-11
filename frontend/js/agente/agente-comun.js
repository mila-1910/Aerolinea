/* ============================================
   JAVASCRIPT COMÚN - MÓDULO AGENTE
   Funcionalidad compartida para todas las páginas
   ============================================ */

// Inicializar dropdown del perfil
function initPerfilDropdown() {
    // El dropdown ahora se maneja por CSS (hover) para coincidir con el estilo premium del cliente.
    // Se mantiene la función por compatibilidad con la inicialización, pero sin listeners de clic.
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
    actualizarPerfilAgente();
    initCerrarSesion();
});

// Actualizar nombre e iniciales del agente
function actualizarPerfilAgente() {
    const u = JSON.parse(localStorage.getItem('usuario'));
    if (!u || !u.nombre_completo) return;

    const nombre = u.nombre_completo;
    // Obtener iniciales (ej: "Juan Fernando" -> "JF")
    const iniciales = nombre.split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    // 1. Navbar: Nombre e Iniciales
    const navbarNombre = document.querySelector('.navbar-perfil .perfil-trigger span:not(.flecha)');
    const navbarAvatar = document.querySelector('.navbar-perfil .avatar');
    if (navbarNombre) navbarNombre.textContent = nombre;
    if (navbarAvatar) navbarAvatar.textContent = iniciales;

    // 3. Saludo del Dashboard (si existe el elemento)
    const saludoP = document.querySelector('.saludo p');
    if (saludoP && saludoP.textContent.includes('Hola,')) {
        saludoP.innerHTML = `Hola, ${nombre} | Aquí puedes gestionar las reservas de los clientes`;
    }
}

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

