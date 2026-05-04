document.addEventListener('DOMContentLoaded', () => {
    // ---- MANEJO DE REGISTRO ----
    const registerForm = document.querySelector('.auth-form[action="#"]');
    if (registerForm && window.location.pathname.includes('register.html')) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const formData = {
                tipo_identificacion: document.getElementById('tipo-identificacion').value,
                numero_identificacion: document.getElementById('numero-identificacion').value,
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                password: document.getElementById('password').value,
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
                    alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                    window.location.href = 'login.html';
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }

    // ---- MANEJO DE LOGIN ----
    const loginForm = document.querySelector('.auth-form[action="../cliente/dashboard.html"]');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            };

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('¡Bienvenido, ' + data.usuario.nombre_completo + '!');
                    // Guardar los datos del usuario en el navegador
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    // Redirigir al dashboard
                    window.location.href = '../cliente/dashboard.html';
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});
