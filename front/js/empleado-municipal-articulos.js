let articulos = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
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

function renderizarTabla(lista) {
    const tbody = document.getElementById('tabla-articulos');
    tbody.textContent = ''; // Limpiar tabla

    for (let art of lista) {
        const row = document.createElement('tr');

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

        // Solo los estados activos
        const tdActivo = document.createElement('td');
        tdActivo.innerHTML = art.activo === 1 ? '<span class="badge est-resuelta">Disponible</span>' : '<span class="badge est-cancelada">No disponible</span>';
        row.appendChild(tdActivo);

        tbody.appendChild(row);
    }
}
