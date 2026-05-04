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
