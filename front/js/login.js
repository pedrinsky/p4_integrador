const API_URL = 'http://localhost:3000/api';

const btnIngresar = document.getElementById('btn-ingresar');
const inputUsuario = document.getElementById('input-usuario');
const inputContrasenia = document.getElementById('input-contrasenia');
const mensajeError = document.getElementById('login-error');

btnIngresar.addEventListener('click', async () => {
    const usuario = inputUsuario.value.trim();
    const contrasenia = inputContrasenia.value.trim();

    // Validación básica en el front
    if (!usuario || !contrasenia) {
        mostrarError('Por favor completá todos los campos.');
        return;
    }

    ocultarError();
    btnIngresar.disabled = true;
    btnIngresar.textContent = 'Ingresando...';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasenia })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarError(data.message || 'Usuario o contraseña incorrectos.');
            return;
        }

        // Guardar el token y datos del usuario en sessionStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));

        // Redirigir según el rol
        redirigirSegunRol(data.usuario);

    } catch (err) {
        console.error(err);
        mostrarError('No se pudo conectar con el servidor.');
    } finally {
        btnIngresar.disabled = false;
        btnIngresar.textContent = 'Ingresar';
    }
});

function redirigirSegunRol(usuario) {
    const rol = String(usuario?.rol);
    if (rol === '1') {
        window.location.href = 'html/director/director-sistemas-sistemas.html';
    } else if (rol === '3') {
        window.location.href = 'html/empleado-sistemas/empleado-sistemas.html';
    } else {
        window.location.href = 'html/empleado-municipal/empleado-municipal.html';
    }
}

function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.style.display = 'block';
}

function ocultarError() {
    mensajeError.textContent = '';
    mensajeError.style.display = 'none';
}
