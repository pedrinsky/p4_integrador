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

    // Actualizar elementos de Avatar (con iniciales)
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

    // Inicializar la campana de notificaciones para Empleado Municipal (2) y de Sistemas (3)
    const rolNum = Number(usuario.rol);
    if (rolNum === 2 || rolNum === 3) {
        inicializarCampanaNotificaciones();
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

/**
 * Agrega y gestiona la campana de notificaciones flotante abajo a la derecha
 * con dropdown interactivo para Empleados Municipales y Empleados de Sistemas.
 */
let intervaloNotificaciones = null;

function inicializarCampanaNotificaciones() {
    // Evitar duplicar el botón flotante si ya existe
    if (document.getElementById('btn-campana-flotante')) return;

    // Crear contenedor flotante abajo a la derecha
    const contNotif = document.createElement('div');
    contNotif.className = 'contenedor-flotante-notificaciones';
    contNotif.innerHTML = `
        <div id="dropdown-notificaciones" class="dropdown-notif-flotante" style="display: none;">
            <div class="dropdown-notif-header">
                <strong>Notificaciones</strong>
                <button id="btn-marcar-todas-leidas" class="btn-marcar-leidas" type="button">Marcar leídas</button>
            </div>
            <ul id="lista-notificaciones" class="lista-notif">
                <li class="notif-item-vacio">Cargando notificaciones...</li>
            </ul>
        </div>
        <button id="btn-campana-flotante" class="btn-campana-flotante" type="button" title="Notificaciones del Sistema">
            <i class="bi bi-bell-fill"></i>
            <span id="badge-contador-notif" class="badge-notif-flotante" style="display: none;">0</span>
        </button>
    `;

    document.body.appendChild(contNotif);

    const btnCampana = document.getElementById('btn-campana-flotante');
    const dropdown = document.getElementById('dropdown-notificaciones');
    const badge = document.getElementById('badge-contador-notif');
    const listaUl = document.getElementById('lista-notificaciones');
    const btnMarcarLeidas = document.getElementById('btn-marcar-todas-leidas');

    // Alternar apertura/cierre del dropdown flotante
    btnCampana.addEventListener('click', (e) => {
        e.stopPropagation();
        const estaVisible = dropdown.style.display === 'flex';
        dropdown.style.display = estaVisible ? 'none' : 'flex';
        if (!estaVisible) {
            cargarNotificaciones();
        }
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!contNotif.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Marcar todas como leídas
    btnMarcarLeidas.addEventListener('click', async (e) => {
        e.stopPropagation();
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const resp = await fetch('http://localhost:3000/api/notificaciones/leer-todas', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resp.ok) {
                badge.style.display = 'none';
                badge.textContent = '0';
                const itemsNoLeidos = listaUl.querySelectorAll('.item-notif.no-leida');
                itemsNoLeidos.forEach(it => it.classList.remove('no-leida'));
            }
        } catch (err) {
            console.error('Error al marcar notificaciones leídas:', err);
        }
    });

    async function cargarNotificaciones() {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const resp = await fetch('http://localhost:3000/api/notificaciones', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!resp.ok) return;

            const data = await resp.json();
            const { notificaciones = [], noLeidas = 0 } = data;

            // Actualizar badge
            if (noLeidas > 0) {
                badge.textContent = noLeidas > 99 ? '99+' : noLeidas;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
                badge.textContent = '0';
            }

            // Renderizar lista en dropdown
            listaUl.textContent = '';
            if (notificaciones.length === 0) {
                const liVacio = document.createElement('li');
                liVacio.className = 'notif-item-vacio';
                liVacio.textContent = 'No hay notificaciones recientes.';
                listaUl.appendChild(liVacio);
                return;
            }

            notificaciones.forEach(notif => {
                const li = document.createElement('li');
                li.className = `item-notif ${Number(notif.leida) === 0 ? 'no-leida' : ''}`;

                let iconoClase = 'bi-bell-fill';
                let tipoClase = '';
                const txt = (notif.mensaje || '').toLowerCase();
                if (txt.includes('asignad')) {
                    iconoClase = 'bi-person-check-fill';
                    tipoClase = 'asignacion';
                } else if (txt.includes('resuelt') || txt.includes('finaliz')) {
                    iconoClase = 'bi-check-circle-fill';
                    tipoClase = 'resolucion';
                } else if (txt.includes('reabr')) {
                    iconoClase = 'bi-arrow-repeat';
                    tipoClase = 'reapertura';
                }

                const fechaFormateada = notif.creado
                    ? new Date(notif.creado).toLocaleString('es-AR', {
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                      })
                    : '';

                li.innerHTML = `
                    <div class="item-notif-icono ${tipoClase}">
                        <i class="bi ${iconoClase}"></i>
                    </div>
                    <div class="item-notif-cuerpo">
                        <div class="item-notif-texto">${notif.mensaje}</div>
                        <div class="item-notif-fecha">${fechaFormateada}</div>
                    </div>
                `;
                listaUl.appendChild(li);
            });
        } catch (err) {
            console.error('Error al consultar notificaciones:', err);
        }
    }

    // Primera carga inmediata
    cargarNotificaciones();

    // Polling cada 25 segundos para actualizar el contador
    if (intervaloNotificaciones) clearInterval(intervaloNotificaciones);
    intervaloNotificaciones = setInterval(cargarNotificaciones, 25000);
}
