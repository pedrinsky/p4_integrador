/**
 * Carga y actualiza los datos del usuario logueado en la interfaz actual:
 * avatar con iniciales, nombre de usuario, saludo de bienvenida y rol.
 */
export function cargarDatosUsuario() {
    const raw = localStorage.getItem('usuarioLogueado') || sessionStorage.getItem('usuario');
    if (!raw) return;

    let usuario;
    try {
        usuario = JSON.parse(raw);
    } catch (e) {
        console.error('Error al leer datos de usuario:', e);
        return;
    }

    if (!usuario) return;

    // 1. Obtener nombres, apellidos y nombre de usuario
    const nombres = (usuario.nombres || usuario.nombre || '').trim();
    const apellidos = (usuario.apellidos || usuario.apellido || '').trim();
    const nombreUsuario = (usuario.usuario || '').trim();

    // 2. Nombre completo para mostrar en la barra superior
    let nombreCompleto = `${nombres} ${apellidos}`.trim();
    if (!nombreCompleto) {
        nombreCompleto = nombreUsuario || 'Usuario';
    }

    // 3. Primer nombre para el saludo
    const primerNombre = (nombres.split(' ')[0] || nombreUsuario || 'Usuario').trim();

    // 4. Iniciales para el avatar circular
    let iniciales = usuario.iniciales;
    if (!iniciales) {
        if (nombres && apellidos) {
            iniciales = `${nombres[0]}${apellidos[0]}`.toUpperCase();
        } else if (nombres) {
            iniciales = nombres.slice(0, 2).toUpperCase();
        } else if (nombreUsuario) {
            iniciales = nombreUsuario.slice(0, 2).toUpperCase();
        } else {
            iniciales = 'US';
        }
    }

    // Actualizar elementos de Avatar (por id o clase)
    const avatares = document.querySelectorAll('#avatar-usuario, #avatar, .avatar-circulo');
    avatares.forEach(el => {
        el.textContent = iniciales;
    });

    // Actualizar elementos de Nombre de Usuario
    const elementosNombre = document.querySelectorAll('#nombre-de-usuario, .nombre-usuario');
    elementosNombre.forEach(el => {
        el.textContent = nombreCompleto;
    });

    // Actualizar saludo de bienvenida en las páginas principales
    const saludos = document.querySelectorAll('#saludo, .saludo-usuario');
    saludos.forEach(el => {
        el.textContent = `Bienvenido, ${primerNombre}`;
    });

    // Actualizar rol si corresponde
    const rolesNombres = {
        1: 'Director de Sistemas',
        '1': 'Director de Sistemas',
        2: 'Empleado Municipal',
        '2': 'Empleado Municipal',
        3: 'Empleado de Sistemas',
        '3': 'Empleado de Sistemas'
    };
    if (usuario.rol && rolesNombres[usuario.rol]) {
        const elementosRol = document.querySelectorAll('.rol-usuario');
        elementosRol.forEach(el => {
            el.textContent = rolesNombres[usuario.rol];
        });
    }
}

function inicializarApp() {
    // 1. Menú hamburguesa y barra lateral
    const botonMenu = document.getElementById('btn-menu');
    const barraLateral = document.querySelector('.lat-bar');

    if (botonMenu && barraLateral) {
        botonMenu.addEventListener('click', () => {
            barraLateral.classList.toggle('oculta');
        });
    }

    // 2. Limpiar sesión al hacer clic en 'Cerrar sesión'
    const logoutLinks = document.querySelectorAll('.logout-item a');
    logoutLinks.forEach(link => {
        link.addEventListener('click', () => {
            sessionStorage.clear();
            localStorage.removeItem('usuarioLogueado');
        });
    });

    // 3. Rellenar datos del usuario logueado en la pantalla
    cargarDatosUsuario();
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}
