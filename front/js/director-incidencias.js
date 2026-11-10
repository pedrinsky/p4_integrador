import { badgesEstado, badgesPrioridad, insertarBadge, renderizarPaginacion } from './utils/ui-utils.js';

let incidencias = [];
let modoHistorial = false;

let paginaActual = 1;
const limitePorPagina = 5;

// Parámetro para resaltar incidencia si proviene desde "Gestionar" en el Dashboard
const urlParams = new URLSearchParams(window.location.search);
const idResaltar = urlParams.get('resaltar');

document.addEventListener('DOMContentLoaded', async () => {
    if (idResaltar) {
        const pag = await calcularPaginaParaIncidencia(idResaltar);
        paginaActual = pag;
        window.paginaActual = pag;
    }
    filtrarDatos();
});

async function calcularPaginaParaIncidencia(idBuscado) {
    try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const resp = await fetch('http://localhost:3000/api/incidencias?limit=1000&exclude_estado=3', { headers });
        if (resp.ok) {
            const data = await resp.json();
            const listado = Array.isArray(data) ? data : (data.incidencias || []);
            const index = listado.findIndex(inc => String(inc.id_incidencia ?? inc.id) === String(idBuscado));
            if (index !== -1) {
                return Math.floor(index / limitePorPagina) + 1;
            }
        }
    } catch (e) {
        console.warn('No se pudo calcular la página para la incidencia a resaltar:', e);
    }
    return 1;
}

// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(listaIncidencias) {
    const tbody = document.getElementById('tabla-incidencias');
    if (!tbody) return;
    tbody.textContent = '';

    if (!Array.isArray(listaIncidencias) || listaIncidencias.length === 0) {
        const row = document.createElement('tr');
        const tdVacio = document.createElement('td');
        tdVacio.colSpan = 8;
        tdVacio.style.textAlign = 'center';
        tdVacio.textContent = 'No se encontraron incidencias.';
        row.appendChild(tdVacio);
        tbody.appendChild(row);
        return;
    }

    let filaParaScroll = null;

    for (let inc of listaIncidencias) {
        const row = document.createElement('tr');
        const idInc = inc.id_incidencia ?? inc.idIncidencia;
        const esSeleccionada = Boolean(idResaltar && String(idInc) === String(idResaltar));

        const tdId = document.createElement('td');
        tdId.textContent = idInc;
        if (esSeleccionada) {
            const badgeSel = document.createElement('span');
            badgeSel.textContent = 'Seleccionada';
            badgeSel.style.marginLeft = '8px';
            badgeSel.style.padding = '3px 8px';
            badgeSel.style.fontSize = '0.75rem';
            badgeSel.style.borderRadius = '4px';
            badgeSel.style.backgroundColor = '#d39e00';
            badgeSel.style.color = '#ffffff';
            badgeSel.style.fontWeight = 'bold';
            tdId.appendChild(badgeSel);
        }
        row.appendChild(tdId);

        const tdCreado = document.createElement('td');
        tdCreado.textContent = inc.creado ? new Date(inc.creado).toLocaleDateString() : '-';
        row.appendChild(tdCreado);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo || inc.articulo_descripcion || (inc.id_articulo ? 'ID ' + inc.id_articulo : '-');
        tdArticulo.className = 'text-truncate';
        tdArticulo.style.maxWidth = '180px';
        row.appendChild(tdArticulo);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = inc.descripcion_pedido || inc.descripcionPedido || '-';
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '250px';
        row.appendChild(tdDescripcion);

        const tdPrioridad = document.createElement('td');
        insertarBadge(tdPrioridad, badgesPrioridad[inc.prioridad] ? badgesPrioridad[inc.prioridad]() : (inc.prioridad ?? '-'));
        row.appendChild(tdPrioridad);

        const tdCreadopor = document.createElement('td');
        tdCreadopor.textContent = inc.creado_por || inc.creadoPor || '-';
        row.appendChild(tdCreadopor);

        const tdEstado = document.createElement('td');
        const estKey = inc.id_estado ?? inc.estado;
        insertarBadge(tdEstado, badgesEstado[estKey] ? badgesEstado[estKey]() : (inc.estado ?? inc.id_estado ?? '-'));
        row.appendChild(tdEstado);

        const tdAcciones = document.createElement('td');
        const botonAccion = document.createElement('button');
        botonAccion.className = 'btn-accion';

        const isCancelada = inc.id_estado === 4 || inc.estado === 'Cancelada';
        const isResuelta = inc.id_estado === 3 || inc.estado === 'Resuelta';

        if (isCancelada) {
            // Cancelada -> Bloqueado totalmente
            botonAccion.textContent = 'Cancelada';
            botonAccion.disabled = true;
            botonAccion.style.opacity = '0.5';
            botonAccion.style.cursor = 'not-allowed';
            botonAccion.title = 'No se puede asignar una incidencia cancelada';
        } else if (isResuelta) {
            // Resuelta -> Bloqueado
            botonAccion.textContent = 'Resuelta';
            botonAccion.disabled = true;
            botonAccion.style.opacity = '0.5';
            botonAccion.style.cursor = 'not-allowed';
            botonAccion.title = 'La incidencia ya fue resuelta';
        } else {
            // Activa -> Asignar o Reasignar
            botonAccion.textContent = inc.asignado_a ? 'Reasignar' : 'Asignar';
            botonAccion.addEventListener('click', () => {
                abrirModalAsignacion(idInc);
            });
        }

        tdAcciones.appendChild(botonAccion);
        row.appendChild(tdAcciones);

        if (esSeleccionada) {
            row.style.backgroundColor = '#fff8db';
            row.style.boxShadow = 'inset 4px 0 0 #d39e00, 0 0 12px rgba(211, 158, 0, 0.45)';
            row.style.transition = 'all 0.4s ease';
            filaParaScroll = row;
        }

        tbody.appendChild(row);
    }

    if (filaParaScroll) {
        setTimeout(() => {
            filaParaScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    }
}




async function filtrarDatos(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
        if (event.target && event.target.id === 'btn-buscar') {
            window.paginaActual = 1;
        }
    }
    
    let url = `http://localhost:3000/api/incidencias?page=${window.paginaActual || 1}&limit=${limitePorPagina}`;
    
    const textoFiltroArea = document.getElementById('filtro-nro-articulo');
    if (textoFiltroArea) {
        const textoFiltro = textoFiltroArea.value.trim();
        if (textoFiltro) url += `&search=${encodeURIComponent(textoFiltro)}`;
    }

    const estadoFiltroArea = document.getElementById('filtro-estado');
    if (estadoFiltroArea) {
        let estadoFiltro = estadoFiltroArea.value;
        if (modoHistorial) {
            url += `&estado=3`;
        } else {
            if (estadoFiltro) {
                url += `&estado=${estadoFiltro}`;
            } else {
                url += `&exclude_estado=3`;
            }
        }
    }

    const prioridadFiltroArea = document.getElementById('filtro-prioridad');
    if (prioridadFiltroArea) {
        const prioridadFiltro = prioridadFiltroArea.value;
        if (prioridadFiltro) url += `&prioridad=${prioridadFiltro}`;
    }

    try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const respuesta = await fetch(url, { headers });
        if (respuesta.ok) {
            const data = await respuesta.json();
            const listado = Array.isArray(data) ? data : (data.incidencias || []);
            incidencias = listado;
            renderizarTabla(listado);
            if (data.paginacion) {
                renderizarPaginacion(data.paginacion, 'paginacionIncidencias', (pag) => {
                    paginaActual = pag;
                    window.paginaActual = pag;
                    filtrarDatos();
                });
            } else {
                const contenedor = document.getElementById('paginacionIncidencias');
                if (contenedor) contenedor.textContent = '';
            }
        }
    } catch(e) {
        console.error("Error pidiendo datos:", e);
    }
}


// --- LOGICA DEL MODAL DE ASIGNACION ---
async function abrirModalAsignacion(id) {
    const incActual = incidencias.find(i => (i.id_incidencia ?? i.idIncidencia) == id);
    if (incActual && (incActual.id_estado === 4 || incActual.estado === 'Cancelada')) {
        alert('No se puede asignar una incidencia que se encuentra cancelada.');
        return;
    }

    const modal = document.getElementById('modal-asignacion');
    const spanId = document.getElementById('asignar-id-incidencia');
    const selector = document.getElementById('selector-empleado');
    
    if (spanId && modal) {
        spanId.textContent = id;
        
        if (selector) {
            selector.textContent = '';
            const optCargando = document.createElement('option');
            optCargando.value = '';
            optCargando.textContent = 'Cargando empleados de sistemas...';
            selector.appendChild(optCargando);

            try {
                const token = sessionStorage.getItem('token');
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                let respuesta = await fetch('http://localhost:3000/api/usuarios/sistemas', { headers });
                let lista = [];
                if (respuesta.ok) {
                    lista = await respuesta.json();
                } else {
                    // Fallback a /api/usuarios
                    respuesta = await fetch('http://localhost:3000/api/usuarios', { headers });
                    if (respuesta.ok) {
                        lista = await respuesta.json();
                    }
                }

                // Filtrar exclusivamente empleados con rol 3 (Empleado de Sistemas) y activos
                const empleadosSistemas = Array.isArray(lista)
                    ? lista.filter(emp => Number(emp.rol) === 3 && emp.activo !== 0)
                    : [];

                selector.textContent = '';
                const optDefault = document.createElement('option');
                optDefault.value = '';
                optDefault.textContent = '-- Seleccione Empleado de Sistemas --';
                selector.appendChild(optDefault);

                if (empleadosSistemas.length === 0) {
                    const optVacio = document.createElement('option');
                    optVacio.value = '';
                    optVacio.disabled = true;
                    optVacio.textContent = 'No hay empleados de sistemas disponibles';
                    selector.appendChild(optVacio);
                } else {
                    empleadosSistemas.forEach(emp => {
                        const opt = document.createElement('option');
                        opt.value = emp.id_usuario;
                        const nombreCompleto = `${emp.nombres || ''} ${emp.apellidos || ''}`.trim() || emp.usuario;
                        opt.textContent = `${nombreCompleto} (${emp.usuario || emp.email || 'Sistemas'})`;
                        selector.appendChild(opt);
                    });
                }
            } catch (e) {
                console.error('Error cargando empleados de sistemas:', e);
                selector.textContent = '';
                const optError = document.createElement('option');
                optError.value = '';
                optError.textContent = 'Error al cargar empleados';
                selector.appendChild(optError);
            }
        }
        
        modal.style.display = 'flex';
    }
}

function cerrarModalAsignacion() {
    const modal = document.getElementById('modal-asignacion');
    if(modal) modal.style.display = 'none';
}

async function confirmarAsignacion() {
    const spanId = document.getElementById('asignar-id-incidencia');
    const idIncidencia = spanId ? spanId.textContent : null;
    const selector = document.getElementById('selector-empleado');
    
    if (!idIncidencia) {
        alert("No se encontró la incidencia a asignar.");
        return;
    }

    if (!selector || !selector.value) {
        alert("Seleccione un empleado de sistemas por favor.");
        return;
    }
    
    const idEmpleado = parseInt(selector.value);
    const nombreEmpleado = selector.options[selector.selectedIndex].text;

    try {
        const token = sessionStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const respuesta = await fetch(`http://localhost:3000/api/incidencias/${idIncidencia}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                asignado_a: idEmpleado,
                id_estado: 2 // Cambia a estado "En Proceso"
            })
        });

        if (respuesta.ok) {
            alert(`¡Éxito! La incidencia #${idIncidencia} ha sido asignada a ${nombreEmpleado}.`);
            cerrarModalAsignacion();
            filtrarDatos();
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            alert(`Error al asignar la incidencia: ${errorData.error || respuesta.statusText}`);
        }
    } catch (e) {
        console.error('Error al realizar asignación:', e);
        alert('Hubo un error de conexión al intentar asignar la incidencia.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', filtrarDatos);
    }

    const btnResueltas = document.getElementById('btn-resueltas');
    if (btnResueltas) {
        btnResueltas.addEventListener('click', (event) => {
            event.preventDefault(); 
            modoHistorial = !modoHistorial;

            if (modoHistorial) {
                btnResueltas.classList.add('historial-activo');
                btnResueltas.textContent = 'Volver a Pendientes';
            } else {
                btnResueltas.classList.remove('historial-activo');
                btnResueltas.textContent = 'Incidencias Resueltas';
            }

            window.paginaActual = 1;

            if(document.getElementById('filtro-estado')) document.getElementById('filtro-estado').value = '';
            if(document.getElementById('filtro-prioridad')) document.getElementById('filtro-prioridad').value = '';
            if(document.getElementById('filtro-nro-articulo')) document.getElementById('filtro-nro-articulo').value = '';

            filtrarDatos(event);
        });
    }

    const btnCerrar = document.getElementById('btn-cerrar-modal');
    if(btnCerrar) btnCerrar.addEventListener('click', cerrarModalAsignacion);

    const btnConfirmar = document.getElementById('btn-confirmar-asignacion');
    if(btnConfirmar) btnConfirmar.addEventListener('click', confirmarAsignacion);
});