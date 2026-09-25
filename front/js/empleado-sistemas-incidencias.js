import { incidencias } from '../datos';

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
document.addEventListener('DOMContentLoaded', () => {
    renderizarTabla(incidencias);
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
        const botonFinalizar = document.createElement('button');
        botonFinalizar.textContent = 'Finalizar';

        if (inc.id_estado > 2) {
            botonFinalizar.className = 'btn-accion';
        } else {
            botonFinalizar.className = 'btn-accion';
        }
        tdAcciones.appendChild(botonFinalizar);
        row.appendChild(tdAcciones);

        // AGREGO UNA FILA CON TODAS LA CELDAS A LA TABLA
        tbody.appendChild(row);
    }
}

const formulario = document.getElementById('form-filtro');

function filtrarDatos(event) {
    // EVITO EL COMPORTAMIENTO POR DEFECTO DEL BOTON submit
    event.preventDefault();
    const filtro = document.getElementById('filtro-nro-articulo').value;

    const resultadosFiltrados = incidencias.filter(inc => {
        const descripcionNormalizada = inc.articulo_descripcion.toLowerCase();
        const busquedaNormalizada = filtro.toLowerCase().trim();
        return descripcionNormalizada.includes(busquedaNormalizada);
    });
    // RENDERIZO LA TABLA CON LOS DATOS FILTRADOS
    renderizarTabla(resultadosFiltrados);
}

// REGISTRO LA FUNCIÓN DE FILTRADO PARA RESPONDER AL EVENTO 'submit' DEL FORMULARIO
formulario.addEventListener('submit', filtrarDatos);
