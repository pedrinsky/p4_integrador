let categorias = []; // Almacena datos reales del servidor

// ESPERO A QUE LA PAGINA HTML SE DESCARGUE Y SE CONSTRUYA POR COMPLETO
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Pedimos los datos al backend
        const response = await fetch('http://localhost:3000/api/categorias');
        if (response.ok) {
            categorias = await response.json();
            renderizarTabla(categorias);
        } else {
            console.error('No se pudieron obtener las categorias: ', response.status);
        }
    } catch (error) {
        console.error('Hubo un error de conexión con el backend:', error);
    }
});


// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(categ) {

    const tbody = document.getElementById('tabla-categorias');

    // LIMPIO LOS DATOS QUE PUEDA TENER LA TABLA
    tbody.textContent = '';

    for (let cat of categ) {
        // CREO UNA FILA PARA LA TABLA
        const row = document.createElement('tr');

        // CREO CELDAS, ASIGNO VALORES Y AGREGO A LA FILA
        const tdId = document.createElement('td');
        tdId.textContent = cat.id_categoria;
        row.appendChild(tdId);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = cat.descripcion;
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '50px';
        row.appendChild(tdDescripcion);

        const tdActivo = document.createElement('td');
        tdActivo.innerHTML = cat.activo === 1 ? 'Sí' : 'No';
        row.appendChild(tdActivo);

        // AGREGO UNA FILA CON TODAS LA CELDAS A LA TABLA
        tbody.appendChild(row);
    }
}

