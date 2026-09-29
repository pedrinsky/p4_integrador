let articulos = []; // Almacena datos reales del servidor

// ESPERO A QUE LA PAGINA HTML SE DESCARGUE Y SE CONSTRUYA POR COMPLETO
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Pedimos los datos al backend
        const response = await fetch('http://localhost:3000/api/articulos');
        if (response.ok) {
            articulos = await response.json();
            renderizarTabla(articulos);
        } else {
            console.error('No se pudieron obtener los articulos: ', response.status);
        }
    } catch (error) {
        console.error('Hubo un error de conexión con el backend:', error);
    }
});


// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(lista) {

    const tbody = document.getElementById('tabla-articulos');

    // LIMPIO LOS DATOS QUE PUEDA TENER LA TABLA
    tbody.textContent = '';

    for (let art of lista) {
        // CREO UNA FILA PARA LA TABLA
        const row = document.createElement('tr');

        // CREO CELDAS, ASIGNO VALORES Y AGREGO A LA FILA
        const tdId = document.createElement('td');
        tdId.textContent = art.id_articulo;
        row.appendChild(tdId);

        const tdArea = document.createElement('td');
        tdArea.textContent = art.area_descripcion || ('ID ' + art.id_area);
        row.appendChild(tdArea);

        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = art.categoria_descripcion || ('ID ' + art.id_categoria);
        tdCategoria.className = 'text-truncate';
        tdCategoria.style.maxWidth = '50px';
        row.appendChild(tdCategoria);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = art.descripcion;
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '50px';
        row.appendChild(tdDescripcion);

        const tdActivo = document.createElement('td');
        tdActivo.innerHTML = art.activo === 1 ? 'Sí' : 'No';
        row.appendChild(tdActivo);

        // AGREGO UNA FILA CON TODAS LA CELDAS A LA TABLA
        tbody.appendChild(row);
    }
}

const botonCrear = document.getElementById('btn-buscar');


