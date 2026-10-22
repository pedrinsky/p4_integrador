let articulos = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/articulos');
        if (response.ok) {
            const data = await response.json();
            articulos = data.articulos ? data.articulos : data;
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
    if (!tbody) return;
    tbody.textContent = ''; // Limpiar tabla

    if (!Array.isArray(lista) || lista.length === 0) {
        const row = document.createElement('tr');
        const tdVacio = document.createElement('td');
        tdVacio.colSpan = 5;
        tdVacio.style.textAlign = 'center';
        tdVacio.textContent = 'No se encontraron artículos.';
        row.appendChild(tdVacio);
        tbody.appendChild(row);
        return;
    }

    for (let art of lista) {
        const row = document.createElement('tr');
        const idArt = art.id_articulo ?? art.idArticulo;

        const tdId = document.createElement('td');
        tdId.textContent = idArt;
        row.appendChild(tdId);

        const tdArea = document.createElement('td');
        tdArea.textContent = art.area || 'Desconocida';
        row.appendChild(tdArea);

        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = art.categoria || 'Desconocida';
        tdCategoria.className = 'text-truncate';
        tdCategoria.style.maxWidth = '150px';
        row.appendChild(tdCategoria);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = art.descripcion || '-';
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '250px';
        row.appendChild(tdDescripcion);

        const tdActivo = document.createElement('td');
        const badgeActivo = document.createElement('span');
        const isActivo = art.activo === 1 || art.activo === true || art.activo === '1';
        badgeActivo.className = isActivo ? 'badge est-resuelta' : 'badge est-cancelada';
        badgeActivo.textContent = isActivo ? 'Disponible' : 'No disponible';
        tdActivo.appendChild(badgeActivo);
        row.appendChild(tdActivo);

        tbody.appendChild(row);
    }
}
