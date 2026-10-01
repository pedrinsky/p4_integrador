//Voy a hacer el objeto que contenga las incidencias que traiga FETCH
let categorias = [];
let textoFiltro = '';
let debounceTimer = null; //usamos debouncer para que el usuario pueda escribir en tiempo real sin mandar una consulta por cada letra tipeada
let modalCategoriaBS = null;

const URL_API_CATEGORIAS = 'http://localhost:3000/api/v1/categorias';

const badgesEstado = {
    1: '<span class="badge bg-success">Activo</span>',
    0: '<span class="badge bg-secondary">Inactivo</span>',
};

async function cargarCategorias(pagina = 1) {
    try {
        // Enviamos el número de página solicitado
        //limit siendo la cantidad de filas en la página
        let url = `${URL_API_CATEGORIAS}?page=${pagina}&limit=10`;
        
        if (textoFiltro) {
            url += `&search=${encodeURIComponent(textoFiltro)}`;
        }

        const res = await fetch(url);
        // Corroboramos si la respuesta vino bien o no
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }

        const data = await res.json(); 
        
        categorias = Array.isArray(data) ? data : (data.categorias || []);

        //Dibujamos la tabla con los registros de la página actual
        renderizarTabla(categorias);

        //Dibujamos los botones de paginación si el backend devolvió datos adicionales
        if (data.paginacion) {
            renderizarPaginacion(data.paginacion, 'paginacionCategorias', cargarCategorias);
        }

    } catch (e) {
        console.error('Fallo al conectar con el servidor:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //Inicializar la instancia del Modal de Bootstrap
    const modalEl = document.getElementById('modalCategoria');
    if (modalEl && window.bootstrap) {
        modalCategoriaBS = new bootstrap.Modal(modalEl);
    }

    //Carga inicial de datos de la tabla
    cargarCategorias();

    //Elementos del filtro
    const inputFiltro = document.getElementById('filtroCategoria');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const formFiltro = document.getElementById('form-filtro');

    if (inputFiltro) {
        inputFiltro.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                textoFiltro = inputFiltro.value.trim();
                cargarCategorias(1);
            }, 300);
        });
    }

    if (formFiltro) {
        formFiltro.addEventListener('submit', (e) => e.preventDefault());
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (inputFiltro) inputFiltro.value = '';
            textoFiltro = '';
            cargarCategorias(1);
        });
    }

    //Botón para abrir modal en modo CREACIÓN
    const btnNuevo = document.getElementById('btn-nueva-categoria');
    if (btnNuevo) {
        btnNuevo.addEventListener('click', () => {
            crearCategoria();
        });
    }

    //Submit del formulario del modal (guarda tanto altas como ediciones)
    const formModal = document.getElementById('form-modal-categoria');
    if (formModal) {
        formModal.addEventListener('submit', guardarCategoria);
    }
});

// FUNCIÓN PARA DIBUJAR LOS DATOS EN LA TABLA
function renderizarTabla(categorias) {

    const tbody = document.getElementById('tabla-categorias');
    if (!tbody) {
        return;
    }
    // LIMPIO LOS DATOS QUE PUEDA TENER LA TABLA
    tbody.textContent = '';

    for (let cat of categorias) {
        // CREO UNA FILA PARA LA TABLA
        const row = document.createElement('tr');

        // CREO CELDAS, ASIGNO VALORES Y AGREGO A LA FILA
        const tdId = document.createElement('td');
        tdId.textContent = cat.id_categoria;
        row.appendChild(tdId);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = cat.descripcion;
        tdDescripcion.className = 'text-truncate col-acortada';
        row.appendChild(tdDescripcion);

        const tdActivo = document.createElement('td');
        tdActivo.textContent = cat.activo;
        tdActivo.innerHTML = badgesEstado[cat.activo]
        row.appendChild(tdActivo);

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'd-flex gap-2';

        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.className = 'btn btn-sm btn-primary';
        botonEditar.addEventListener('click', () => {
            editarCategoria(cat.id_categoria);
        });

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.className = 'btn btn-sm btn-danger';
        botonEliminar.addEventListener('click', () => {
            eliminarCategoria(cat.id_categoria);
        });

        tdAcciones.appendChild(botonEditar);
        tdAcciones.appendChild(botonEliminar);
        row.appendChild(tdAcciones);

        // AGREGO UNA FILA CON TODAS LA CELDAS A LA TABLA
        tbody.appendChild(row);
    }
}

// ABRIR MODAL PARA CREAR (Campos vacíos)
function crearCategoria() {
    document.getElementById('form-modal-categoria').reset();
    document.getElementById('categoria-id').value = '';
    document.getElementById('modalTitulo').textContent = 'Nueva Categoría';
    modalCategoriaBS.show();
}

// ABRIR MODAL PARA EDITAR (Consume el READ individual)
async function editarCategoria(id) {
    try {
        const res = await fetch(`${URL_API_CATEGORIAS}/${id}`);
        if (!res.ok) throw new Error(`Error al leer categoría: ${res.status}`);

        const data = await res.json();
        const cat = data.categoria;

        // Poblamos los campos del modal con los datos actuales
        document.getElementById('categoria-id').value = cat.id_categoria;
        document.getElementById('categoria-descripcion').value = cat.descripcion;
        document.getElementById('modalTitulo').textContent = `Editar Categoría #${cat.id_categoria}`;

        modalCategoriaBS.show();
    } catch (e) {
        console.error('Error al cargar datos para edición:', e);
        alert('No se pudo cargar la información de la categoría.');
    }
}

// GUARDAR: Detecta si corresponde POST o PUT según si hay ID presente
async function guardarCategoria(e) {
    e.preventDefault();

    const id = document.getElementById('categoria-id').value;
    const descripcion = document.getElementById('categoria-descripcion').value.trim();

    if (!descripcion) return;

    const esEdicion = Boolean(id);
    const url = esEdicion ? `${URL_API_CATEGORIAS}/${id}` : URL_API_CATEGORIAS;
    const method = esEdicion ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion })
        });

        if (!res.ok) throw new Error(`Error en el guardado: ${res.status}`);

        modalCategoriaBS.hide();
        await cargarCategorias();
    } catch (error) {
        console.error('Fallo al guardar la categoría:', error);
        alert('Hubo un error al procesar la categoría.');
    }
}

// ELIMINAR / BAJA LÓGICA (DELETE)
async function eliminarCategoria(id) {
    const confirmar = confirm(`¿Desea dar de baja la categoría ID ${id}?`);
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_API_CATEGORIAS}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);
        await cargarCategorias();
    } catch (e) {
        console.error('Fallo al eliminar categoría:', e);
        alert('Hubo un error al dar de baja la categoría.');
    }
}
