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

        // Calcular iniciales a partir de nombres y apellidos
        const nombres = (data.usuario?.nombres || data.usuario?.nombre || '').trim();
        const apellidos = (data.usuario?.apellidos || data.usuario?.apellido || '').trim();
        let iniciales = '';

        if (nombres && apellidos) {
            iniciales = `${nombres[0]}${apellidos[0]}`.toUpperCase();
        } else if (nombres) {
            iniciales = nombres.slice(0, 2).toUpperCase();
        } else if (data.usuario?.usuario) {
            iniciales = data.usuario.usuario.slice(0, 2).toUpperCase();
        } else {
            iniciales = 'US';
        }

        const usuarioCompleto = {
            ...data.usuario,
            nombre: nombres,
            apellido: apellidos,
            iniciales
        };

        // Guardar el token y datos del usuario en sessionStorage y localStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioCompleto));

        // Redirigir según el rol
        redirigirSegunRol(usuarioCompleto);

    } catch (err) {
        console.error(err);
        mostrarError('No se pudo conectar con el servidor.');
    } finally {
        btnIngresar.disabled = false;
        btnIngresar.textContent = 'Ingresar';
    }
});

// Permitir presionar Enter en los campos de login
[inputUsuario, inputContrasenia].forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btnIngresar.click();
        }
    });
});

function redirigirSegunRol(usuario) {
    const rol = String(usuario?.rol);
    if (rol === '1') {
        window.location.href = 'html/director/director-sistemas-dashboard.html';
    } else if (rol === '3') {
        window.location.href = 'html/empleado-sistemas/empleado-sistemas-incidencias.html';
    } else {
        window.location.href = 'html/empleado-municipal/empleado-municipal-incidencias.html';
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
