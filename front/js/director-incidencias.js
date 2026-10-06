let incidencias = []; // Almacena datos reales del servidor para poder filtrarlos después
let modoHistorial = false;

const badgesEstado = {
    1: '<span class="badge est-pendiente">Pendiente</span>',
    2: '<span class="badge est-proceso">En Proceso</span>',
    3: '<span class="badge est-resuelta">Resuelta</span>',
    4: '<span class="badge est-cancelada">Cancelada</span>'
};

const badgesPrioridad = {
    1: '<span class="badge prio-baja">Baja</span>',
    2: '<span class="badge prio-media">Media</span>',
    3: '<span class="badge prio-alta">Alta</span>'
};


// ESPERO A QUE LA PAGINA HTML SE DESCARGUE Y SE CONSTRUYA POR COMPLETO
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Pedimos los datos al backend en vez de un archivo local
        const response = await fetch('http://localhost:3000/api/incidencias');
        if (response.ok) {
            incidencias = await response.json();
            // Por defecto arranca fuera del modo historial, filtramos las resueltas (3)
            renderizarTabla(incidencias.filter(inc => inc.id_estado != 3));
        } else {
            console.error('No se pudieron obtener las incidencias: ', response.status);
        }
    } catch (error) {
        console.error('Hubo un error de conexión con el backend:', error);
    }
});

// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(listaIncidencias) {

    const tbody = document.getElementById('tabla-incidencias');

    // LIMPIO LOS DATOS QUE PUEDA TENER LA TABLA
    tbody.textContent = '';

    for (let inc of listaIncidencias) {
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
    
    // Aquí a futuro se hará el fetch PUT a la base de datos
    alert(`¡Éxito! La incidencia #${idIncidencia} ha sido asignada a ${nombreEmpleado}.`);
    cerrarModalAsignacion();
}

// --- LOGICA DE FILTROS ---
document.addEventListener('DOMContentLoaded', () => {
    // BOTON BUSCAR
    const btnBuscar = document.getElementById('btn-buscar');
    
    function filtrarDatos(event) {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        
        const estado = document.getElementById('filtro-estado').value;
        const prioridad = document.getElementById('filtro-prioridad').value;
        const texto = document.getElementById('filtro-nro-articulo').value.toLowerCase();

        const filtradas = incidencias.filter(inc => {
            // Aseguramos que respete en qué modo estamos (Historial o Pendientes)
            if (modoHistorial && inc.id_estado != 3) return false;
            // SIEMPRE que no estemos en modo historial, ocultamos las resueltas (estado 3)
            if (!modoHistorial && inc.id_estado == 3) return false;

            if (estado && inc.id_estado != estado) return false;
            if (prioridad && inc.prioridad != prioridad) return false;
            if (texto && !inc.id_incidencia.toString().includes(texto) && !inc.articulo_descripcion.toLowerCase().includes(texto)) {
                return false;
            }
            return true;
        });
        renderizarTabla(filtradas);
    }

    if (btnBuscar) {
        btnBuscar.addEventListener('click', filtrarDatos);
    }

    // BOTON INCIDENCIAS RESUELTAS (HISTORIAL)
    const btnResueltas = document.getElementById('btn-resueltas');
    if (btnResueltas) {
        btnResueltas.addEventListener('click', (event) => {
            event.preventDefault(); // Evita recarga

            modoHistorial = !modoHistorial;

            if (modoHistorial) {
                btnResueltas.classList.add('historial-activo');
                btnResueltas.innerHTML = 'Volver a Pendientes'; 
            } else {
                btnResueltas.classList.remove('historial-activo');
                btnResueltas.innerHTML = 'Incidencias Resueltas';
            }

            // Limpiamos los filtros visuales al cambiar de modo
            document.getElementById('filtro-estado').value = '';
            document.getElementById('filtro-prioridad').value = '';
            document.getElementById('filtro-nro-articulo').value = '';

            filtrarDatos(event);
        });
    }

    // BOTONES MODAL
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    if(btnCerrar) btnCerrar.addEventListener('click', cerrarModalAsignacion);

    const btnConfirmar = document.getElementById('btn-confirmar-asignacion');
    if(btnConfirmar) btnConfirmar.addEventListener('click', confirmarAsignacion);
});