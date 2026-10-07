import { badgesEstado, badgesPrioridad, renderizarPaginacion } from './utils/ui-utils.js';

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
    tbody.textContent = '';

    for (let inc of incidencias) {
        // CREO UNA FILA PARA LA TABLA
        const row = document.createElement('tr');

        // CREO CELDAS, ASIGNO VALORES Y AGREGO A LA FILA
        const tdId = document.createElement('td');
        tdId.textContent = inc.id_incidencia;
        row.appendChild(tdId);

        const tdCreado = document.createElement('td');
        tdCreado.textContent = inc.creado;
        row.appendChild(tdCreado);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo_descripcion;
        tdArticulo.className = 'text-truncate';
        tdArticulo.style.maxWidth = '50px';
        row.appendChild(tdArticulo);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = inc.descripcion_pedido;
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '50px';
        row.appendChild(tdDescripcion);

        const tdPrioridad = document.createElement('td');
        tdPrioridad.innerHTML = badgesPrioridad[inc.prioridad];
        row.appendChild(tdPrioridad);

        const tdEstado = document.createElement('td');
        tdEstado.innerHTML = badgesEstado[inc.id_estado];
        row.appendChild(tdEstado);

        const tdAcciones = document.createElement('td');
        const botonAccion = document.createElement('button');
        botonAccion.className = 'btn-accion';

        if (inc.id_estado === 4) {
            // Cancelada -> bloqueado
            botonAccion.textContent = 'Cancelada';
            botonAccion.disabled = true;
            botonAccion.style.opacity = '0.5';
            botonAccion.style.cursor = 'not-allowed';
        } else if (inc.id_estado === 3) {
            // Resuelta -> Opción de Reabrir
            botonAccion.textContent = 'Reabrir';
            botonAccion.style.backgroundColor = '#378b26'; // Amarillo alerta
            botonAccion.style.color = '#ffffffff';
            
            botonAccion.addEventListener('click', async () => {
                const confirmar = confirm('¿Estás seguro de que deseas reabrir esta incidencia y devolverla a Pendiente?');
                if (!confirmar) return;

                const respuesta = await fetch(`http://localhost:3000/api/incidencias/${inc.id_incidencia}/reabrir`, {
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

                const respuesta = await fetch(`http://localhost:3000/api/incidencias/${inc.id_incidencia}/finalizar`, {
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
        if (event.target && event.target.id === 'btn-buscar') window.paginaActual = 1;
    }
    
    let url = `http://localhost:3000/api/incidencias?page=${window.paginaActual || 1}&limit=${limitePorPagina}`;

    const textoFiltro = document.getElementById('filtro-nro-articulo').value.trim();
    if (textoFiltro) url += `&search=${encodeURIComponent(textoFiltro)}`;

    let estadoFiltro = document.getElementById('filtro-estado').value;
    
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

    const prioridadFiltro = document.getElementById('filtro-prioridad').value;
    if (prioridadFiltro) url += `&prioridad=${prioridadFiltro}`;

    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            const data = await respuesta.json();
            incidencias = data.incidencias;
            renderizarTabla(data.incidencias);
            if (data.paginacion) {
                renderizarPaginacion(data.paginacion, 'paginacionIncidencias', (pag) => {
                    window.paginaActual = pag;
                    filtrarDatos();
                });
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
            botonHistorial.innerHTML = 'Volver a Pendientes'; 
        } else {
            botonHistorial.classList.remove('historial-activo');
            botonHistorial.innerHTML = 'Mis Resueltas';
        }

        window.paginaActual = 1; 

        document.getElementById('filtro-estado').value = '';
        document.getElementById('filtro-prioridad').value = '';
        document.getElementById('filtro-nro-articulo').value = '';

        filtrarDatos(event);
    });
}