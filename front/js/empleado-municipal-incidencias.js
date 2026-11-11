import { badgesEstado, badgesPrioridad, insertarBadge, renderizarPaginacion } from './utils/ui-utils.js';

let misIncidencias = [];

let paginaActual = 1;
const limitePorPagina = 5;

document.addEventListener('DOMContentLoaded', async () => {
    cargarIncidencias();
    configurarModal();
    loadArticulosForSelect();
});

async function cargarIncidencias() {
    let url = `http://localhost:3000/api/incidencias?page=${window.paginaActual || 1}&limit=${limitePorPagina}`;
    // Ocultar canceladas (estado 4)
    url += '&exclude_estado=4';

    try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(url, { headers });
        if (response.ok) {
            const data = await response.json();
            const listado = Array.isArray(data) ? data : (data.incidencias || []);
            misIncidencias = listado; 
            renderizarTabla(listado);
            if (data.paginacion) {
                renderizarPaginacion(data.paginacion, 'paginacionIncidencias', (pag) => {
                    paginaActual = pag;
                    window.paginaActual = pag;
                    cargarIncidencias();
                });
            } else {
                const contenedor = document.getElementById('paginacionIncidencias');
                if (contenedor) contenedor.textContent = '';
            }
        } else {
            console.error('Error al obtener incidencias:', response.status);
        }
    } catch (error) {
        console.error('Hubo un error de conexión con el backend:', error);
    }
}

async function loadArticulosForSelect() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:3000/api/articulos?limit=100&activo=1', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`}
        });
        if (response.ok) {
            const data = await response.json();
            const arts = Array.isArray(data) ? data : (data.articulos || []);
            const select = document.getElementById('selector-articulo');
            if (!select) return;
            select.textContent = '';
            // Re-agregar la opción por defecto "ninguno"
            const optDefault = document.createElement('option');
            optDefault.value = '';
            optDefault.textContent = '-- General (Ninguno) --';
            select.appendChild(optDefault);
            for (let a of arts) {
                const opt = document.createElement('option');
                const idArt = a.id_articulo ?? a.idArticulo;
                opt.value = idArt;
                opt.textContent = `${idArt} - ${a.descripcion}`;
                select.appendChild(opt);
            }
        }
    } catch(e) {
        console.error('Error cargando artículos:', e);
    }
}

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

        // Fecha (creado)
        const tdCreado = document.createElement('td');
        tdCreado.textContent = inc.creado ? new Date(inc.creado).toLocaleDateString() : 'N/A';
        row.appendChild(tdCreado);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo_descripcion || inc.articulo || (inc.id_articulo ? 'ID '+inc.id_articulo : '-');
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

        // Nueva columna Accion
        const tdAccion = document.createElement('td');
        tdAccion.className = 'text-center';
        const esResuelta = inc.id_estado === 3 || inc.estado === 'Resuelta';
        const esCancelada = inc.id_estado === 4 || inc.estado === 'Cancelada';

        if (!esResuelta && !esCancelada) {
            const btnCancelar = document.createElement('button');
            btnCancelar.textContent = 'Cancelar';
            btnCancelar.className = 'btn-buscar'; 
            btnCancelar.style.padding = '4px 8px';
            btnCancelar.onclick = () => cancelarIncidencia(idInc);
            tdAccion.appendChild(btnCancelar);
        } else if (esResuelta) {
            // Empleado municipal puede solicitar reabrir la incidencia resuelta
            const btnReabrir = document.createElement('button');
            btnReabrir.textContent = 'Solicitar Reapertura';
            btnReabrir.className = 'btn-buscar';
            btnReabrir.style.backgroundColor = '#fd7e14';
            btnReabrir.style.color = '#ffffff';
            btnReabrir.style.padding = '4px 10px';
            btnReabrir.style.fontSize = '0.85rem';
            btnReabrir.title = 'Solicitar reapertura de la incidencia para revisión técnica';
            btnReabrir.onclick = () => solicitarReapertura(idInc);
            tdAccion.appendChild(btnReabrir);
        }
        row.appendChild(tdAccion);

        tbody.appendChild(row);
    }
}

async function solicitarReapertura(id_incidencia) {
    if (!confirm(`¿Desea solicitar la reapertura de la incidencia #${id_incidencia}? Se notificará al técnico a cargo.`)) return;
    try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`http://localhost:3000/api/incidencias/${id_incidencia}/solicitar-reapertura`, {
            method: 'PUT',
            headers
        });
        if (res.ok) {
            alert('¡Solicitud enviada! El técnico asignado ha recibido la notificación y revisará la reapertura.');
            cargarIncidencias();
        } else {
            const data = await res.json().catch(() => ({}));
            alert(`No se pudo enviar la solicitud: ${data.error || res.statusText}`);
        }
    } catch (e) {
        console.error('Error al solicitar reapertura:', e);
        alert('Error de conexión al solicitar reapertura.');
    }
}



async function cancelarIncidencia(id_incidencia) {
    if (!confirm('¿Seguro que desea cancelar esta incidencia?')) return;
    try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('http://localhost:3000/api/incidencias/' + id_incidencia, {
            method: 'DELETE',
            headers
        });
        if (res.ok) {
            alert('Incidencia cancelada con éxito');
            cargarIncidencias();
        } else {
            alert('Hubo un problema al cancelar.');
        }
    } catch(e) {
        alert('Error de conexión.');
    }
}

function configurarModal() {
    const modal = document.getElementById('modal-crear-incidencia');
    const btnAbrir = document.getElementById('btn-crear-incidencia');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const btnConfirmar = document.getElementById('btn-confirmar-creacion');

    if (btnAbrir) {
        btnAbrir.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', async () => {
            const descArea = document.getElementById('input-desc');
            const prioArea = document.getElementById('selector-prio');
            const artArea = document.getElementById('selector-articulo');
            
            const descripcion_pedido = descArea ? descArea.value : '';
            const prioridad = prioArea ? prioArea.value : 1;
            const selectorArticulo = artArea ? artArea.value : '';

            const usuarioGuardado = localStorage.getItem('usuarioLogueado');
            // Lo convierte a objeto de JavaScript (o un objeto vacío si no existe)
            const usuarioObj = usuarioGuardado ? JSON.parse(usuarioGuardado) : {};

            if (!descripcion_pedido) {
                alert("Por favor, describa el problema antes de guardar.");
                return;
            }

            const bodyRequerido = {
                descripcion_pedido: descripcion_pedido.trim(),
                prioridad: parseInt(prioridad, 10) || 1,
            };

            const idArticuloNum = parseInt(selectorArticulo, 10);
            if (!isNaN(idArticuloNum) && idArticuloNum > 0) {
                bodyRequerido.id_articulo = idArticuloNum;
            }

            const idCreador = parseInt(usuarioObj.id_usuario || usuarioObj.id, 10);
            if (!isNaN(idCreador) && idCreador > 0) {
                bodyRequerido.creado_por = idCreador;
            }

            try {
                const token = sessionStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch('http://localhost:3000/api/incidencias', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(bodyRequerido)
                });
                
                if (response.ok) {
                    alert('Incidencia creada con éxito!');
                    //limpiar campos del modal
                    if (descArea) descArea.value = '';
                    if (prioArea) prioArea.value = '1';
                    if (artArea) artArea.value = '';
                    modal.style.display = 'none';
                    
                    window.paginaActual = 1;

                    // Refrescar los datos
                    cargarIncidencias();
                } else {
                    const data = await response.json();
                    console.error("Error validación:", data);
                    alert("No se pudo crear. Asegúrese de que el ID Artículo exista (si lo brindó).");
                }
            } catch (error) {
                console.error("Error al publicar incidencia: ", error);
                alert("Hubo un error de conexión con el Servidor.");
            }
        });
    }
}
