import { badgesEstado, badgesPrioridad, insertarBadge, renderizarPaginacion } from './utils/ui-utils.js';

let incidencias = []; 
let modoHistorial = false;

let paginaActual = 1;
const limitePorPagina = 5;

document.addEventListener('DOMContentLoaded', () => {
    // Al cargar la página, traemos los datos de la primera página
    filtrarDatos();
});

// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(incidencias) {
    const tbody = document.getElementById('tabla-incidencias');
    if (!tbody) return;
    tbody.textContent = '';

    if (!Array.isArray(incidencias) || incidencias.length === 0) {
        const row = document.createElement('tr');
        const tdVacio = document.createElement('td');
        tdVacio.colSpan = 7;
        tdVacio.style.textAlign = 'center';
        tdVacio.textContent = 'No se encontraron incidencias.';
        row.appendChild(tdVacio);
        tbody.appendChild(row);
        return;
    }

    for (let inc of incidencias) {
        const row = document.createElement('tr');
        const idInc = inc.id_incidencia ?? inc.idIncidencia;

        const tdId = document.createElement('td');
        tdId.textContent = idInc;
        row.appendChild(tdId);

        const tdCreado = document.createElement('td');
        tdCreado.textContent = inc.creado ? new Date(inc.creado).toLocaleDateString() : '';
        row.appendChild(tdCreado);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo_descripcion || inc.articulo || '-';
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

        const tdEstado = document.createElement('td');
        const estKey = inc.id_estado ?? inc.estado;
        insertarBadge(tdEstado, badgesEstado[estKey] ? badgesEstado[estKey]() : (inc.estado ?? inc.id_estado ?? '-'));
        row.appendChild(tdEstado);

        const tdAcciones = document.createElement('td');
        const botonAccion = document.createElement('button');
        botonAccion.className = 'btn-accion';

        const isCancelada = inc.id_estado === 4 || inc.estado === 'Cancelada';
        const isResuelta = inc.id_estado === 3 || inc.estado === 'Resuelta' || inc.estado === 'Resuela';

        if (isCancelada) {
            // Cancelada -> bloqueado
            botonAccion.textContent = 'Cancelada';
            botonAccion.disabled = true;
            botonAccion.style.opacity = '0.5';
            botonAccion.style.cursor = 'not-allowed';
        } else if (isResuelta) {
            // Resuelta -> Opción de Reabrir
            botonAccion.textContent = 'Reabrir';
            botonAccion.style.backgroundColor = '#378b26'; // Verde/amarillo alerta
            botonAccion.style.color = '#ffffffff';
            
            botonAccion.addEventListener('click', async () => {
                const confirmar = confirm('¿Estás seguro de que deseas reabrir esta incidencia y devolverla a Pendiente?');
                if (!confirmar) return;

                const respuesta = await fetch(`http://localhost:3000/api/incidencias/${idInc}/reabrir`, {
                    method: 'PUT'
                });
                if (respuesta.ok) {
                    alert('¡Incidencia ha vuelto a Pendiente!');
                    filtrarDatos(); 
                } else {
                    alert('Error al intentar reabrir la incidencia');
                }
            });
        } else {
            // Estado 1 o 2 -> Opción de Finalizar
            botonAccion.textContent = 'Finalizar';
            
            botonAccion.addEventListener('click', async () => {
                const descripcion = prompt("Ingrese una descripción o comentario para la resolución (opcional):", "");
                if (descripcion === null) return;

                const respuesta = await fetch(`http://localhost:3000/api/incidencias/${idInc}/finalizar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ descripcion_resolucion: descripcion })
                });
                if (respuesta.ok) {
                    alert('¡Incidencia finalizada con éxito!');
                    filtrarDatos();
                } else {
                    alert('Error al intentar finalizar la incidencia');
                }
            });
        }
        
        tdAcciones.appendChild(botonAccion);
        row.appendChild(tdAcciones);
        tbody.appendChild(row);
    }
}




async function filtrarDatos(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault(); 
        // Si se apretó el boton buscar, reseteamos a la página 1
        if (event.target && event.target.id === 'btn-buscar') {
            paginaActual = 1;
            window.paginaActual = 1;
        }
    }
    
    const pag = paginaActual || window.paginaActual || 1;
    let url = `http://localhost:3000/api/incidencias?page=${pag}&limit=${limitePorPagina}`;

    const inputTexto = document.getElementById('filtro-nro-articulo');
    if (inputTexto) {
        const textoFiltro = inputTexto.value.trim();
        if (textoFiltro) url += `&search=${encodeURIComponent(textoFiltro)}`;
    }

    const selectEstado = document.getElementById('filtro-estado');
    let estadoFiltro = selectEstado ? selectEstado.value : '';
    
    // Logica Historial vs Pendientes
    if (modoHistorial) {
        url += `&estado=3`;
    } else {
        if (estadoFiltro) {
            url += `&estado=${estadoFiltro}`;
        } else {
            // Si no elige estado y estamos en Pendientes, omitir las resueltas(3)
            url += `&exclude_estado=3`;
        }
    }

    const selectPrioridad = document.getElementById('filtro-prioridad');
    const prioridadFiltro = selectPrioridad ? selectPrioridad.value : '';
    if (prioridadFiltro) url += `&prioridad=${prioridadFiltro}`;

    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            const data = await respuesta.json();
            const listado = Array.isArray(data) ? data : (data.incidencias || []);
            incidencias = listado;
            renderizarTabla(listado);
            if (data.paginacion) {
                renderizarPaginacion(data.paginacion, 'paginacionIncidencias', (nuevaPag) => {
                    paginaActual = nuevaPag;
                    window.paginaActual = nuevaPag;
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

const botonBuscar = document.getElementById('btn-buscar');
if (botonBuscar) {
    botonBuscar.addEventListener('click', filtrarDatos);
}

const botonHistorial = document.getElementById('btn-historial-resueltas');
if (botonHistorial) {
    botonHistorial.addEventListener('click', (event) => {
        event.preventDefault(); 

        modoHistorial = !modoHistorial;

        if (modoHistorial) {
            botonHistorial.classList.add('historial-activo');
            botonHistorial.textContent = 'Volver a Pendientes';
        } else {
            botonHistorial.classList.remove('historial-activo');
            botonHistorial.textContent = 'Mis Resueltas';
        }

        paginaActual = 1;
        window.paginaActual = 1; 

        if (document.getElementById('filtro-estado')) document.getElementById('filtro-estado').value = '';
        if (document.getElementById('filtro-prioridad')) document.getElementById('filtro-prioridad').value = '';
        if (document.getElementById('filtro-nro-articulo')) document.getElementById('filtro-nro-articulo').value = '';

        filtrarDatos(event);
    });
}