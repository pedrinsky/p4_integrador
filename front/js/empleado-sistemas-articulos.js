import { renderizarPaginacion } from './utils/ui-utils.js';

let articulos = [];
let textoFiltro = '';
let paginaActual = 1;
const limitePorPagina = 5;
let modoPapelera = false;

const URL_API_ARTICULOS = 'http://localhost:3000/api/articulos';
const URL_API_CATEGORIAS = 'http://localhost:3000/api/categorias';

document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('modal-creacion');
    const btnAbrirModal = document.getElementById('btn-abrir-creacion');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const formModal = document.getElementById('form-modal-articulo');

    // Cerrar modal
    const cerrarModal = () => {
        if (modal) modal.style.display = 'none';
    };

    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', cerrarModal);

    cargarArticulos();

    const inputFiltro = document.getElementById('filtro-descripcion');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnPapelera = document.getElementById('btn-papelera');

    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            if (inputFiltro) {
                textoFiltro = inputFiltro.value.trim();
                cargarArticulos(1);
            }
        });
    }

    if (inputFiltro) {
        inputFiltro.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                textoFiltro = inputFiltro.value.trim();
                cargarArticulos(1);
            }
        });
    }

    if (btnPapelera) {
        btnPapelera.addEventListener('click', () => {
            modoPapelera = !modoPapelera;
            if (modoPapelera) {
                alert("¡CUIDADO! Estás entrando a la Papelera de Reciclaje.\n\nEliminar definitivamente un artículo lo purgará físicamente.");
                btnPapelera.style.backgroundColor = '#dc3545';
                btnPapelera.textContent = 'Salir Papelera';
            } else {
                btnPapelera.style.backgroundColor = '#6c757d';
                btnPapelera.textContent = 'Papelera';
            }
            cargarArticulos(1);
        });
    }

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', async () => {
            // Limpiar form
            if(formModal) formModal.reset();
            document.getElementById('articulo-id').value = '';
            document.getElementById('modalTitulo').textContent = 'Nuevo Artículo';
            document.getElementById('btn-confirmar-creacion').textContent = 'Añadir Artículo';
            
            await cargarSelectorCategorias();
            modal.style.display = 'flex';
        });
    }

    if (formModal) {
        formModal.addEventListener('submit', guardarArticulo);
    }
});

async function cargarSelectorCategorias() {
    try {
        const res = await fetch(`${URL_API_CATEGORIAS}?limit=100`);
        if (res.ok) {
            const data = await res.json();
            const listado = data.categorias || data;
            const selectCat = document.getElementById('selector-categoria');
            selectCat.innerHTML = '<option value="">-- Categoría --</option>'; // Clean
            listado.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id_categoria;
                opt.textContent = c.descripcion;
                selectCat.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Error cargando categorias dinámicas:", err);
    }
}

async function cargarArticulos(pagina = paginaActual) {
    paginaActual = pagina;
    let url = `${URL_API_ARTICULOS}?page=${paginaActual}&limit=${limitePorPagina}`;
    
    if (textoFiltro) {
        url += `&descripcion=${encodeURIComponent(textoFiltro)}`;
    }
    if (modoPapelera) {
        url += `&activo=0`;
    } else {
        url += `&activo=1`; 
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.articulos) {
                articulos = data.articulos;
                renderizarTabla(data.articulos);
                if (data.paginacion) {
                    renderizarPaginacion(data.paginacion, 'paginacionIncidencias', (pag) => {
                        cargarArticulos(pag);
                    });
                }
            } else {
                articulos = data;
                renderizarTabla(data);
            }
        } else {
            console.error('No se pudieron obtener los articulos: ', response.status);
        }
    } catch (error) {
        console.error('Hubo un error de conexión con el backend:', error);
    }
}

function renderizarTabla(lista) {
    const tbody = document.getElementById('tabla-articulos');
    if (!tbody) return;
    tbody.textContent = '';

    for (let art of lista) {
        const row = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = art.id_articulo;
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
        tdDescripcion.textContent = art.descripcion;
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '250px';
        row.appendChild(tdDescripcion);

        const tdActivo = document.createElement('td');
        tdActivo.innerHTML = art.activo === 1 
            ? '<span class="badge est-resuelta">Sí</span>' 
            : '<span class="badge est-cancelada">No</span>';
        row.appendChild(tdActivo);

        // BOTONERA
        const tdAcciones = document.createElement('td');
        const botonesContainer = document.createElement('div');
        botonesContainer.style.display = 'flex';
        botonesContainer.style.justifyContent = 'center';
        botonesContainer.style.gap = '10px';
        
        if (!modoPapelera) {
            const botonEditar = document.createElement('button');
            botonEditar.textContent = 'Editar';
            botonEditar.className = 'btn-buscar';
            botonEditar.style.padding = '4px 12px';
            botonEditar.addEventListener('click', () => {
                editarArticulo(art.id_articulo);
            });

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.className = 'btn-buscar';
            botonEliminar.style.backgroundColor = '#6c757d'; 
            botonEliminar.style.padding = '4px 12px';
            botonEliminar.addEventListener('click', () => {
                eliminarArticulo(art.id_articulo);
            });

            botonesContainer.appendChild(botonEditar);
            botonesContainer.appendChild(botonEliminar);
        } else {
            const botonReactivar = document.createElement('button');
            botonReactivar.textContent = 'Reactivar';
            botonReactivar.className = 'btn-buscar';
            botonReactivar.style.backgroundColor = '#28a745';
            botonReactivar.style.padding = '4px 12px';
            botonReactivar.addEventListener('click', () => {
                reactivarArticulo(art.id_articulo);
            });

            const botonDestruir = document.createElement('button');
            botonDestruir.textContent = 'Destruir';
            botonDestruir.className = 'btn-buscar';
            botonDestruir.style.backgroundColor = '#dc3545'; 
            botonDestruir.style.padding = '4px 12px';
            botonDestruir.addEventListener('click', () => {
                borradoDefinitivo(art.id_articulo);
            });

            botonesContainer.appendChild(botonReactivar);
            botonesContainer.appendChild(botonDestruir);
        }
        
        tdAcciones.appendChild(botonesContainer);
        row.appendChild(tdAcciones);

        tbody.appendChild(row);
    }
}



async function editarArticulo(id) {
    try {
        const res = await fetch(`${URL_API_ARTICULOS}/${id}`);
        if (!res.ok) throw new Error(`Error al leer artículo: ${res.status}`);

        const data = await res.json();
        const art = Array.isArray(data) ? data[0] : (data.articulo || data); 
        
        if (!art || art.id_articulo === undefined) {
             throw new Error('Formato de datos no esperado de la API');
        }

        await cargarSelectorCategorias();

        document.getElementById('articulo-id').value = art.id_articulo;
        document.getElementById('input-descripcion').value = art.descripcion;
        document.getElementById('selector-area').value = art.id_area;
        document.getElementById('selector-categoria').value = art.id_categoria;
        document.getElementById('selector-activo').value = art.activo;

        document.getElementById('modalTitulo').textContent = `Editar Artículo #${art.id_articulo}`;
        document.getElementById('btn-confirmar-creacion').textContent = 'Guardar Cambios';

        const modal = document.getElementById('modal-creacion');
        if (modal) modal.style.display = 'flex';

    } catch (e) {
        console.error('Error al cargar datos para edición:', e);
        alert('No se pudo cargar la información del artículo.');
    }
}

async function guardarArticulo(e) {
    e.preventDefault();

    const id = document.getElementById('articulo-id').value;
    const descripcion = document.getElementById('input-descripcion').value.trim();
    const idArea = document.getElementById('selector-area').value;
    const idCategoria = document.getElementById('selector-categoria').value;
    const activo = document.getElementById('selector-activo').value;

    if (!descripcion || !idArea || !idCategoria) {
        alert("Por favor, complete todos los campos obligatorios antes de continuar.");
        return;
    }

    const esEdicion = Boolean(id);
    const url = esEdicion ? `${URL_API_ARTICULOS}/${id}` : URL_API_ARTICULOS;
    const method = esEdicion ? 'PATCH' : 'POST';
    
    // Convert to integers
    const bodyPayload = { 
        descripcion: descripcion,
        id_area: parseInt(idArea),
        id_categoria: parseInt(idCategoria),
        activo: parseInt(activo)
    };

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(`Error en el guardado: ${res.status} ${errData ? JSON.stringify(errData) : ''}`);
        }

        const modal = document.getElementById('modal-creacion');
        if (modal) modal.style.display = 'none';

        if (!esEdicion) {
            await cargarArticulos(1);
        } else {
            await cargarArticulos(paginaActual);
        }
        
    } catch (error) {
        console.error('Fallo al guardar el artículo:', error);
        alert('Hubo un error al procesar el artículo. Verifica la base de datos.');
    }
}

async function eliminarArticulo(id) {
    const confirmar = confirm(`¿Desea dar de baja el artículo ID ${id}?`);
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_API_ARTICULOS}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);
        await cargarArticulos(paginaActual);
    } catch (e) {
        console.error('Fallo al eliminar articulo:', e);
        alert('Hubo un error al dar de baja el artículo.');
    }
}

async function reactivarArticulo(id) {
    const confirmar = confirm(`¿Desea reactivar el artículo ID ${id}?`);
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_API_ARTICULOS}/${id}/reactivar`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);
        await cargarArticulos(paginaActual);
    } catch (e) {
        console.error('Fallo al reactivar artículo:', e);
        alert('Hubo un error al reactivar el artículo.');
    }
}

async function borradoDefinitivo(id) {
    const confirmar = confirm(`CUIDADO: ¿Desea ejecutar un BORRADO FÍSICO Y DEFINITIVO del artículo ID ${id}?\n\nSi ha sido asignado a una incidencia en algún momento y se registró, esto lanzará un error para proteger tu información histórica.`);
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_API_ARTICULOS}/${id}/definitivo`, {
            method: 'DELETE'
        });
        
        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.error || `Error ${res.status}`);
        }
        
        await cargarArticulos(paginaActual);
    } catch (e) {
        console.error('Fallo al destruir artículo:', e);
        alert(`Hubo un error al destruirlo definitivamente:\n${e.message}`);
    }
}
