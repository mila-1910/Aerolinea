/* ============================================
   JAVASCRIPT COMÚN - MÓDULO AGENTE
   Funcionalidad compartida para todas las páginas
   ============================================ */

// Base de API dinámica para resolver fallos de puertos o protocolos localmente (ej: Live Server o file://)
window.API_BASE = (window.location.port === '3000') ? '' : 'http://localhost:3000';

// Inicializar dropdown del perfil
function initPerfilDropdown() {
    // El dropdown ahora se maneja por CSS (hover) para coincidir con el estilo premium del cliente.
    // Se mantiene la función por compatibilidad con la inicialización, pero sin listeners de clic.
}

function verificarRolUsuario() {
    const u = JSON.parse(localStorage.getItem('usuario'));
    console.log('Usuario en sesión (Agente):', u);
    const rol = u && u.rol ? u.rol.toLowerCase().trim() : '';
    console.log('Rol detectado (Agente):', rol);

    const rolesPermitidos = [
        'agente', 
        'agente de aerolínea', 
        'agente de aerolinea', 
        'administrador', 
        'admin', 
        'super administrador'
    ];

    if (!u || !rolesPermitidos.includes(rol)) {
        console.warn('Acceso denegado. Redirigiendo a login...');
        window.location.href = '../inicio/login.html';
    }
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {
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
        link.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('usuario');
            window.location.href = loginUrl;
        });
    });
}

// Función global para mostrar banner visual de error si falla la comunicación con la API
window.mostrarBannerError = function(error) {
    if (document.getElementById('api-error-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'api-error-banner';
    banner.style.backgroundColor = '#f8d7da';
    banner.style.color = '#721c24';
    banner.style.padding = '15px';
    banner.style.marginBottom = '20px';
    banner.style.borderRadius = '8px';
    banner.style.border = '1px solid #f5c6cb';
    banner.style.fontWeight = 'bold';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.gap = '10px';
    banner.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    banner.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
        <div>
            <strong>Error de comunicación con el servidor (API):</strong> ${error.message}
            <br>
            <span style="font-weight: normal; font-size: 0.85rem;">
                Por favor, asegúrate de que el servidor Express local esté activo ejecutando <code>node index.js</code> dentro de la carpeta <code>backend/</code>.
                El panel necesita conectarse a <code>http://localhost:3000</code> para recuperar los datos reales de Neon.
            </span>
        </div>
    `;

    const main = document.querySelector('.contenido-principal');
    if (main) {
        const saludo = document.querySelector('.saludo');
        if (saludo) {
            saludo.after(banner);
        } else {
            main.prepend(banner);
        }
    }
};

