// ---- SISTEMA DE NOTIFICACIONES PREMIUM (Toast by Emil Design) ----
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
        
        Object.assign(toastContainer.style, {
            position: 'fixed',
            top: '32px',
            right: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: '9999',
            pointerEvents: 'none'
        });
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    // Glassmorphism background: light for success, burgundy for error
    const bgColor = isSuccess ? 'rgba(255, 255, 255, 0.85)' : 'rgba(114, 28, 71, 0.85)';
    const textColor = isSuccess ? '#1f2937' : '#ffffff';
    const iconClass = isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation';
    const iconColor = isSuccess ? '#10b981' : '#fca5a5';

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px;">
            <i class="fa-solid ${iconClass}" style="color: ${iconColor}; font-size: 1.4rem;"></i>
            <span style="font-weight: 600; font-size: 0.95rem; font-family: 'Inter', system-ui, sans-serif; letter-spacing: -0.01em;">${message}</span>
        </div>
    `;

    Object.assign(toast.style, {
        background: bgColor,
        color: textColor,
        padding: '16px 24px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.15)',
        opacity: '0',
        transform: 'translateX(120%) scale(0.9)',
        transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)', // Emil Kowalski spring-like ease
        minWidth: '280px',
        pointerEvents: 'auto'
    });

    toastContainer.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Animación de salida después de 3.5s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px) scale(0.95)';
        toast.style.filter = 'blur(4px)';
        toast.addEventListener('transitionend', () => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    // ---- MANEJO DE REGISTRO ----
    const registerForm = document.querySelector('#register-box .auth-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const formData = {
                tipo_identificacion: document.getElementById('tipo-identificacion').value,
                numero_identificacion: document.getElementById('numero-identificacion').value,
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email-reg').value,
                telefono: document.getElementById('telefono').value,
                password: document.getElementById('password-reg').value,
                confirmar: document.getElementById('confirmar').value,
                terminos: document.getElementById('terminos').checked
            };

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('¡Cuenta creada exitosamente! Bienvenido/a a ELARIS.', 'success');
                    // Hacer auto-login guardando los datos (el backend devuelve el id, nombre y correo)
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    // Redirigir a buscar vuelos tras un pequeño delay para ver la animación
                    setTimeout(() => window.location.href = '../cliente/buscar-vuelos.html', 1800);
                } else {
                    showToast('Error: ' + data.error, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('No se pudo conectar con el servidor.', 'error');
            }
        });
    }

    // ---- MANEJO DE LOGIN ----
    const loginForm = document.querySelector('#login-box .auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                email: document.getElementById('email-login').value,
                password: document.getElementById('password-login').value,
            };

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('¡Bienvenido, ' + data.usuario.nombre_completo + '!', 'success');
                    // Guardar los datos del usuario en el navegador
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    // Redirigir a buscar vuelos tras un delay para ver la animación
                    setTimeout(() => window.location.href = '../cliente/buscar-vuelos.html', 1800);
                } else {
                    showToast('Error: ' + data.error, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('No se pudo conectar con el servidor.', 'error');
            }
        });
    }

    // ---- FUNCIONALIDAD VER CONTRASEÑA ----
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        const togglePassword = function () {
            // El input hermano anterior
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Ocultar contraseña');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Mostrar contraseña');
            }
        };

        icon.addEventListener('click', togglePassword);
        icon.addEventListener('keydown', function(e) {
            // Permitir activar con Enter o Espacio para accesibilidad
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePassword.call(this);
            }
        });
    });

    // ---- TRANSICIONES DE PÁGINA SPA (Emil Kowalski) ----
    const authMain = document.getElementById('auth-main');
    const registerBtns = document.querySelectorAll('.switch-to-register');
    const loginBtns = document.querySelectorAll('.switch-to-login');
    const navBtnLogin = document.getElementById('nav-btn-login');
    const navBtnRegister = document.getElementById('nav-btn-register');

    if (authMain) {
        registerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                authMain.classList.add('is-registering');
                // Actualizar estilos del navbar
                if (navBtnLogin && navBtnRegister) {
                    navBtnLogin.className = 'btn-nav btn-nav--ghost switch-to-login';
                    navBtnRegister.className = 'btn-nav btn-nav--solid switch-to-register';
                }
            });
        });

        loginBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                authMain.classList.remove('is-registering');
                // Actualizar estilos del navbar
                if (navBtnLogin && navBtnRegister) {
                    navBtnLogin.className = 'btn-nav btn-nav--solid switch-to-login';
                    navBtnRegister.className = 'btn-nav btn-nav--ghost switch-to-register';
                }
            });
        });

        // Verificar si venimos desde un link con #register en la URL
        if (window.location.hash === '#register') {
            authMain.classList.add('is-registering');
            // Quitar el delay de la transición para que cargue instantáneamente en el estado de registro
            const authBoxes = document.querySelectorAll('.auth-box, .hero-login, .hero-register, .hero-bg');
            authBoxes.forEach(el => el.style.transition = 'none');
            
            if (navBtnLogin && navBtnRegister) {
                navBtnLogin.className = 'btn-nav btn-nav--ghost switch-to-login';
                navBtnRegister.className = 'btn-nav btn-nav--solid switch-to-register';
            }

            // Restaurar las transiciones un momento después para que las futuras animaciones funcionen
            setTimeout(() => {
                authBoxes.forEach(el => el.style.transition = '');
            }, 50);
        }
    }
});
