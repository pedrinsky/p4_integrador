//Voy a hacer el objeto que contenga las incidencias que traiga FETCH
let incidencias = [];

const URL_API = 'http://localhost:3000/api/v1/incidencias';

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

// FORMATEAR FECHA
function formatearFecha(fechaCruda) {
    if (!fechaCruda) return '-';
    const fecha = new Date(fechaCruda);
    if (isNaN(fecha.getTime())) return fechaCruda; // Si ya viene formateada desde SQL, la deja igual

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const mins = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}-${mes}-${anio} ${horas}:${mins}`;
}

//OBTENER INCIDENCIAS DE LA BASE DE DATOS A TRAVÉS DE FETCH
async function cargarIncidencias() {
    try {
        const res = await fetch(URL_API);

        //Corroboramos si la respuesta vino bien o no
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }

        data = await res.json(); //Guardamos el array de incidencias devuelto por Express
        
        incidencias = Array.isArray(data) ? data : (data.incidencias || []);
        
        console.log('Datos recibidos de la API:', incidencias);
        renderizarTabla(incidencias);
    } catch(e) {
        console.error('Fallo al conectar con el servidor:', e);
    }
}

async function finalizarIncidencia(incidencia){
    try {
        const confirmacion = confirm(`Desea eliminar la incidencia de ID ${incidencia}?`);
        if (!confirmacion){
            return;
        }

        const res = await fetch(`${URL_API}/${incidencia}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok){
            throw new Error(`Error en la petición: ${res.status}`);
        }

        // Si el backend respondió correcto, recargamos la lista para actualizar la vista
        console.log(`En efecto se editó la incidencia con ID ${incidencia}`);
        await cargarIncidencias();
    }catch(e){
        console.error('Fallo al conectar con el servidor:', e);
    }
}

// ESPERO A QUE LA PAGINA HTML SE DESCARGUE Y SE CONSTRUYA POR COMPLETO
document.addEventListener('DOMContentLoaded', () => {
    cargarIncidencias();

    const formulario = document.getElementById('form-filtro');
    const inputFiltro = document.getElementById('articuloFiltro');
    const btnLimpiar = document.getElementById('btn-limpiar');

    //FILTRADO EN TIEMPO REAL 
    if (inputFiltro) {
        inputFiltro.addEventListener('input', () => {
            const busqueda = inputFiltro.value.toLowerCase().trim();

            // Si el campo quedó vacío
            if (busqueda === '') {
                renderizarTabla(incidencias);
                return;
            }

            // Filtramos la lista completa original
            const filtrados = incidencias.filter(inc => {
                const desc = (inc.articulo_descripcion || '').toLowerCase();
                return desc.includes(busqueda);
            });

            renderizarTabla(filtrados);
        });
    }

    //Prevenir que presionar intro recargue la página
    if (formulario) {
        formulario.addEventListener('submit', (e) => e.preventDefault());
    }

    // 3. Botón Borrar
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (inputFiltro){
                inputFiltro.value = ''};
            renderizarTabla(incidencias);
        });
    }
});

// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(incidencias) {

    const tbody = document.getElementById('tabla-incidencias');
    if (!tbody) {
        return;
    }
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
        tdCreado.textContent = formatearFecha(inc.creado);
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
        const botonFinalizar = document.createElement('button');
        botonFinalizar.textContent = 'Finalizar';

        if (inc.id_estado >= 3) {
            // Si ya está resuelta o cancelada
            botonFinalizar.className = 'btn btn-sm btn-secondary disabled';
            botonFinalizar.disabled = true;
        } else {
            // Si está pendiente o en proceso
            botonFinalizar.className = 'btn btn-sm btn-success';

            botonFinalizar.addEventListener('click', () => {
                finalizarIncidencia(inc.id_incidencia);
            });
        }
        tdAcciones.appendChild(botonFinalizar);
        row.appendChild(tdAcciones);

        // AGREGO UNA FILA CON TODAS LA CELDAS A LA TABLA
        tbody.appendChild(row);
    }
}



function filtrarDatos(event) {
    // EVITO EL COMPORTAMIENTO POR DEFECTO DEL BOTON submit
    event.preventDefault();
    const filtro = document.getElementById('articuloFiltro');
    const valorOriginal = filtro ? filtro.value : '';
    const busquedaNormalizada = valorOriginal.toLowerCase().trim();

    if (busquedaNormalizada === ''){
        renderizarTabla(incidencias);
        return;
    }
    const resultadosFiltrados = incidencias.filter(inc => {
        const descripcionNormalizada = (inc.articulo_descripcion || '').toLowerCase();
        return descripcionNormalizada.includes(busquedaNormalizada);
    });
    // RENDERIZO LA TABLA CON LOS DATOS FILTRADOS
    renderizarTabla(resultadosFiltrados);
}




