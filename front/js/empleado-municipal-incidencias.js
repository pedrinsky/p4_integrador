let misIncidencias = [];

const badgesEstado = {
    1: '<span class="badge est-pendiente">Pendiente</span>',
    2: '<span class="badge est-proceso">En Proceso</span>',
    3: '<span class="badge est-resuelta">Resuelta</span>',
    4: '<span class="badge est-cancelada" style="background-color: #6c757d;">Cancelada</span>'
};

const badgesPrioridad = {
    1: '<span class="badge prio-baja">Baja</span>',
    2: '<span class="badge prio-media">Media</span>',
    3: '<span class="badge prio-alta">Alta</span>'
};

document.addEventListener('DOMContentLoaded', async () => {
    cargarIncidencias();
    configurarModal();
    loadArticulosForSelect();
});

async function cargarIncidencias() {
    try {
        const response = await fetch('http://localhost:3000/api/incidencias');
        if (response.ok) {
            const incidenciasTodas = await response.json();
            // Filtro (simulación): Mostrar solo las coincidencias creadas por él.
            misIncidencias = incidenciasTodas; 
            renderizarTabla(misIncidencias);
        } else {
            console.error('Error al obtener incidencias:', response.status);
        }
    } catch (error) {
        console.error('Hubo un error de conexión con el backend:', error);
    }
}

async function loadArticulosForSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/articulos');
        if (response.ok) {
            const arts = await response.json();
            const select = document.getElementById('selector-articulo');
            for (let a of arts) {
                const opt = document.createElement('option');
                opt.value = a.id_articulo;
                opt.textContent = `${a.id_articulo} - ${a.descripcion}`;
                select.appendChild(opt);
            }
        }
    } catch(e) {
        console.error('Error cargando artículos:', e);
    }
}

function renderizarTabla(incidencias) {
    const tbody = document.getElementById('tabla-incidencias');
    tbody.textContent = ''; 

    for (let inc of incidencias) {
        // Ocultar de la vista las que estén canceladas
        if (inc.id_estado === 4) {
            continue;
        }

        const row = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = inc.id_incidencia;
        row.appendChild(tdId);

        // Fecha (creado)
        const tdCreado = document.createElement('td');
        tdCreado.textContent = inc.creado || 'N/A';
        row.appendChild(tdCreado);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo_descripcion || (inc.id_articulo ? 'ID '+inc.id_articulo : '-');
        tdArticulo.className = 'text-truncate';
        tdArticulo.style.maxWidth = '100px';
        row.appendChild(tdArticulo);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = inc.descripcion_pedido;
        // Removido el text-truncate para que salga tal cual
        row.appendChild(tdDescripcion);

        const tdPrioridad = document.createElement('td');
        tdPrioridad.innerHTML = badgesPrioridad[inc.prioridad] || inc.prioridad;
        row.appendChild(tdPrioridad);

        const tdEstado = document.createElement('td');
        tdEstado.innerHTML = badgesEstado[inc.id_estado] || inc.id_estado;
        row.appendChild(tdEstado);

        // Nueva columna Accion
        const tdAccion = document.createElement('td');
        tdAccion.className = 'text-center';
        if (inc.id_estado !== 3 && inc.id_estado !== 4) { // Si no esta resuelta ni cancelada
            const btnCancelar = document.createElement('button');
            btnCancelar.textContent = 'Cancelar';
            btnCancelar.className = 'btn-buscar'; // Usa la clase que ordenó el user
            btnCancelar.style.padding = '4px 8px';
            btnCancelar.onclick = () => cancelarIncidencia(inc.id_incidencia);
            tdAccion.appendChild(btnCancelar);
        }
        row.appendChild(tdAccion);

        tbody.appendChild(row);
    }
}

async function cancelarIncidencia(id_incidencia) {
    if (!confirm('¿Seguro que desea cancelar esta incidencia?')) return;
    try {
        const res = await fetch('http://localhost:3000/api/incidencias/' + id_incidencia, {
            method: 'DELETE'
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
            const descripcion_pedido = document.getElementById('input-desc').value;
            const prioridad = document.getElementById('selector-prio').value;
            const selectorArticulo = document.getElementById('selector-articulo').value;

            if (!descripcion_pedido) {
                alert("Por favor, describa el problema antes de guardar.");
                return;
            }

            const bodyRequerido = {
                id_articulo: selectorArticulo ? parseInt(selectorArticulo) : null,
                descripcion_pedido: descripcion_pedido,
                prioridad: parseInt(prioridad),
                id_estado: 1 // Empieza en PENDIENTE por convención
            };

            try {
                const response = await fetch('http://localhost:3000/api/incidencias', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyRequerido)
                });
                
                if (response.ok) {
                    alert('Incidencia creada con éxito!');
                    // Resetear inputs y cerrar modal
                    document.getElementById('input-desc').value = '';
                    document.getElementById('selector-prio').value = '1';
                    document.getElementById('selector-articulo').value = '';
                    modal.style.display = 'none';

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
