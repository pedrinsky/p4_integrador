import { badgesEstado, badgesPrioridad, renderizarPaginacion } from './utils/ui-utils.js';

let incidencias = [];
let modoHistorial = false;

let paginaActual = 1;
const limitePorPagina = 5;

document.addEventListener('DOMContentLoaded', () => {
    filtrarDatos();
});

// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(listaIncidencias) {
    const tbody = document.getElementById('tabla-incidencias');
    tbody.textContent = '';

    for (let inc of listaIncidencias) {
        const row = document.createElement('tr');

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

        const tdCreadopor = document.createElement('td');
        tdCreadopor.textContent = inc.creado_por;
        row.appendChild(tdCreadopor);

        const tdEstado = document.createElement('td');
        tdEstado.innerHTML = badgesEstado[inc.id_estado];
        row.appendChild(tdEstado);

        const tdAcciones = document.createElement('td');
        const botonAccion = document.createElement('button');
        botonAccion.className = 'btn-accion';
        botonAccion.textContent = 'Asignar';
        
        botonAccion.addEventListener('click', () => {
            abrirModalAsignacion(inc.id_incidencia);
        });

        tdAcciones.appendChild(botonAccion);
        row.appendChild(tdAcciones);

        tbody.appendChild(row);
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


// --- LOGICA DEL MODAL DE ASIGNACION ---
async function abrirModalAsignacion(id) {
    const modal = document.getElementById('modal-asignacion');
    const spanId = document.getElementById('asignar-id-incidencia');
    const selector = document.getElementById('selector-empleado');
    
    if (spanId && modal) {
        spanId.textContent = id;
        
        if (selector) {
            try {
                const respuesta = await fetch('http://localhost:3000/api/usuarios/sistemas');
                if (respuesta.ok) {
                    const empleados = await respuesta.json();
                    selector.innerHTML = '<option value="">-- Empleado de Sistemas --</option>';
                    empleados.forEach(emp => {
                        const opt = document.createElement('option');
                        opt.value = emp.id_usuario;
                        opt.textContent = `${emp.nombres} ${emp.apellidos}`;
                        selector.appendChild(opt);
                    });
                }
            } catch (e) {
                console.error('Error cargando empleados:', e);
            }
        }
        
        modal.style.display = 'flex';
    }
}

function cerrarModalAsignacion() {
    const modal = document.getElementById('modal-asignacion');
    if(modal) modal.style.display = 'none';
}

function confirmarAsignacion() {
    const idIncidencia = document.getElementById('asignar-id-incidencia').textContent;
    const selector = document.getElementById('selector-empleado');
    
    if(!selector.value) {
        alert("Seleccione un empleado por favor.");
        return;
    }
    
    const nombreEmpleado = selector.options[selector.selectedIndex].text;
    alert(`¡Éxito! La incidencia #${idIncidencia} ha sido asignada a ${nombreEmpleado}.`);
    cerrarModalAsignacion();
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
                btnResueltas.innerHTML = 'Volver a Pendientes'; 
            } else {
                btnResueltas.classList.remove('historial-activo');
                btnResueltas.innerHTML = 'Incidencias Resueltas';
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