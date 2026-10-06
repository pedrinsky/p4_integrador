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
function renderizarTabla(incidencias) {


    const tbody = document.getElementById('tabla-incidencias');

    // LIMPIO LOS DATOS QUE PUEDA TENER LA TABLA
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
        tdEstado.textContent = inc.id_estado;
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
                    // En vez de recargar la página entera (que resetea el modo), 
                    // solo recargamos los datos para seguir en el mismo Historial
                    const res = await fetch('http://localhost:3000/api/incidencias');
                    incidencias = await res.json();
                    filtrarDatos({ preventDefault: () => {} }); 
                } else {
                    alert('Error al intentar reabrir la incidencia');
                }
            });
        } else {
            // Estado 1 o 2 -> Opción de Finalizar
            botonAccion.textContent = 'Finalizar';
            
            botonAccion.addEventListener('click', async () => {
                // Aparece la ventanita preguntando por una descripción
                const descripcion = prompt("Ingrese una descripción o comentario para la resolución (opcional):", "");
                
                // Si el usuario presiona "Cancelar" en la ventanita, detenemos el proceso
                if (descripcion === null) return;

                const respuesta = await fetch(`http://localhost:3000/api/incidencias/${inc.id_incidencia}/finalizar`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ descripcion_resolucion: descripcion })
                });
                if (respuesta.ok) {
                    alert('¡Incidencia finalizada con éxito!');
                    // Idem, actualizamos los datos internamente
                    const res = await fetch('http://localhost:3000/api/incidencias');
                    incidencias = await res.json();
                    filtrarDatos({ preventDefault: () => {} });
                } else {
                    alert('Error al intentar finalizar la incidencia');
                }
            });
        }
        
        tdAcciones.appendChild(botonAccion);
        row.appendChild(tdAcciones);

        // AGREGO UNA FILA CON TODAS LA CELDAS A LA TABLA
        tbody.appendChild(row);
    }
}

const botonBuscar = document.getElementById('btn-buscar');

function filtrarDatos(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault(); // Por si el boton está dentro de un form en el futuro
    }
    
    const textoFiltro = document.getElementById('filtro-nro-articulo').value.toLowerCase().trim();
    const estadoFiltro = document.getElementById('filtro-estado').value;
    const prioridadFiltro = document.getElementById('filtro-prioridad').value;

    const resultadosFiltrados = incidencias.filter(inc => {
        // Aseguramos que respete en qué modo estamos (Historial o Pendientes)
        if (modoHistorial && inc.id_estado != 3) return false;
        if (!modoHistorial && inc.id_estado == 3) return false;

        //Filtro de Texto (busca en artículo, en descripción o si es el número exacto de ID)
        const coincideTexto = textoFiltro === '' || 
            (inc.articulo_descripcion && inc.articulo_descripcion.toLowerCase().includes(textoFiltro)) ||
            (inc.descripcion_pedido && inc.descripcion_pedido.toLowerCase().includes(textoFiltro)) ||
            (inc.id_incidencia && inc.id_incidencia.toString() === textoFiltro);
            
        //Filtro de Estado
        const coincideEstado = estadoFiltro === '' || inc.id_estado.toString() === estadoFiltro;
        
        //Filtro de Prioridad
        const coincidePrioridad = prioridadFiltro === '' || inc.prioridad.toString() === prioridadFiltro;

        // Comprueba que la incidencia cumpla todas las condiciones seleccionadas
        return coincideTexto && coincideEstado && coincidePrioridad;
    });
    
    // RENDERIZO LA TABLA CON LOS DATOS QUE QUEDARON FILTRADOS
    renderizarTabla(resultadosFiltrados);
}

// REGISTRO LA FUNCIÓN DE FILTRADO PARA RESPONDER AL CLICK DEL BOTON
if (botonBuscar) {
    botonBuscar.addEventListener('click', filtrarDatos);
}

//el modo historial como todavia no hay usuarios. 
// muestra todo y solo cambia el estado del filtro a resueltas
const botonHistorial = document.getElementById('btn-historial-resueltas');

if (botonHistorial) {
    botonHistorial.addEventListener('click', (event) => {
        event.preventDefault(); // Evita que se recargue la página si estuviera en un formulario

        // Alterna el modo
        modoHistorial = !modoHistorial;

        if (modoHistorial) {
            botonHistorial.classList.add('historial-activo');
            botonHistorial.innerHTML = 'Volver a Pendientes'; 
        } else {
            botonHistorial.classList.remove('historial-activo');
            botonHistorial.innerHTML = 'Mis Resueltas';
        }

        // Limpia los filtros visuales siempre que cambiamos de modo
        document.getElementById('filtro-estado').value = '';
        document.getElementById('filtro-prioridad').value = '';
        document.getElementById('filtro-nro-articulo').value = '';

        //la misma funcion de filtrarDatos porque ya sabe qué hacer gracias a la variable `modoHistorial`
        filtrarDatos(event);
    });
}