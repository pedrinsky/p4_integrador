import { renderizarPaginacion } from './utils/ui-utils.js';

let categorias = [];
let textoFiltro = '';
let debounceTimer = null;
let paginaActual = 1;
const limitePorPagina = 5;
let modoPapelera = false;

const URL_API_CATEGORIAS = 'http://localhost:3000/api/categorias';

document.addEventListener('DOMContentLoaded', () => {

    const modalEl = document.getElementById('modalCategoria');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');

    // Cerrar modal
    const cerrarModal = () => {
        if (modalEl) modalEl.style.display = 'none';
    };

    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', cerrarModal);

    cargarCategorias();

    const inputFiltro = document.getElementById('filtroCategoria');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnNuevo = document.getElementById('btn-nueva-categoria');
    const formModal = document.getElementById('form-modal-categoria');

    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            if (inputFiltro) {
                textoFiltro = inputFiltro.value.trim();
                cargarCategorias(1);
            }
        });
    }

    // Opcional: También buscar al presionar "Enter" en el input
    if (inputFiltro) {
        inputFiltro.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                textoFiltro = inputFiltro.value.trim();
                cargarCategorias(1);
            }
        });
    }

    if (btnNuevo) {
        btnNuevo.addEventListener('click', () => {
            crearCategoria();
        });
    }

    const btnPapelera = document.getElementById('btn-papelera');

    if (btnPapelera) {
        btnPapelera.addEventListener('click', () => {
            modoPapelera = !modoPapelera;
            if (modoPapelera) {
                alert("¡CUIDADO! Estás entrando a la Papelera de Reciclaje.\n\nEliminar definitivamente una categoría puede romper registros históricos de artículos que dependan de ella.");
                btnPapelera.style.backgroundColor = '#dc3545';
                btnPapelera.textContent = 'Salir Papelera';
            } else {
                btnPapelera.style.backgroundColor = '#6c757d';
                btnPapelera.textContent = 'Papelera';
            }
            cargarCategorias(1);
        });
    }

    if (formModal) {
        formModal.addEventListener('submit', guardarCategoria);
    }
});

async function cargarCategorias(pagina = paginaActual) {
    paginaActual = pagina;
    let url = `${URL_API_CATEGORIAS}?page=${paginaActual}&limit=${limitePorPagina}`;
    if (textoFiltro) {
        url += `&search=${encodeURIComponent(textoFiltro)}`;
    }
    if (modoPapelera) {
        url += `&activo=0`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.categorias) {
                categorias = data.categorias;
                renderizarTabla(data.categorias);
                if (data.paginacion) {
                    renderizarPaginacion(data.paginacion, 'paginacionCategorias', (pag) => {
                        cargarCategorias(pag);
                    });
                }
            } else {
                categorias = data;
                renderizarTabla(data);
            }
        } else {
            console.error('No se pudieron obtener las categorias: ', response.status);
        }
    } catch (error) {
        console.error('Hubo un error de conexión con el backend:', error);
    }
}

function renderizarTabla(categ) {
    const tbody = document.getElementById('tabla-categorias');
    if (!tbody) return;
    tbody.textContent = '';

    for (let cat of categ) {
        const row = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = cat.id_categoria;
        row.appendChild(tdId);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = cat.descripcion;
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '250px';
        row.appendChild(tdDescripcion);

        const tdActivo = document.createElement('td');
        tdActivo.innerHTML = cat.activo === 1 
            ? '<span class="badge est-resuelta">Sí</span>' 
            : '<span class="badge est-cancelada">No</span>';
        row.appendChild(tdActivo);

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
                editarCategoria(cat.id_categoria);
            });

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.className = 'btn-buscar';
            botonEliminar.style.backgroundColor = '#6c757d'; // Color apagado
            botonEliminar.style.padding = '4px 12px';
            botonEliminar.addEventListener('click', () => {
                eliminarCategoria(cat.id_categoria);
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
                reactivarCategoria(cat.id_categoria);
            });

            const botonDestruir = document.createElement('button');
            botonDestruir.textContent = 'Destruir';
            botonDestruir.className = 'btn-buscar';
            botonDestruir.style.backgroundColor = '#dc3545'; 
            botonDestruir.style.padding = '4px 12px';
            botonDestruir.addEventListener('click', () => {
                borradoDefinitivo(cat.id_categoria);
            });

            botonesContainer.appendChild(botonReactivar);
            botonesContainer.appendChild(botonDestruir);
        }
        
        tdAcciones.appendChild(botonesContainer);
        row.appendChild(tdAcciones);

        tbody.appendChild(row);
    }
}




function crearCategoria() {
    document.getElementById('form-modal-categoria').reset();
    document.getElementById('categoria-id').value = '';
    document.getElementById('modalTitulo').textContent = 'Nueva Categoría';
    
    const modalEl = document.getElementById('modalCategoria');
    if (modalEl) modalEl.style.display = 'flex';
}

async function editarCategoria(id) {
    try {
        const res = await fetch(`${URL_API_CATEGORIAS}/${id}`);
        if (!res.ok) throw new Error(`Error al leer categoría: ${res.status}`);

        const data = await res.json();
        const cat = data.categoria || data; 
        
        if (!cat || cat.id_categoria === undefined) {
             throw new Error('Formato de datos no esperado de la API');
        }

        document.getElementById('categoria-id').value = cat.id_categoria;
        document.getElementById('categoria-descripcion').value = cat.descripcion;
        document.getElementById('modalTitulo').textContent = `Editar Categoría #${cat.id_categoria}`;

        const modalEl = document.getElementById('modalCategoria');
        if (modalEl) modalEl.style.display = 'flex';

    } catch (e) {
        console.error('Error al cargar datos para edición:', e);
        alert('No se pudo cargar la información de la categoría.');
    }
}

async function guardarCategoria(e) {
    e.preventDefault();

    const id = document.getElementById('categoria-id').value;
    const descripcion = document.getElementById('categoria-descripcion').value.trim();

    if (!descripcion) return;

    const esEdicion = Boolean(id);
    const url = esEdicion ? `${URL_API_CATEGORIAS}/${id}` : URL_API_CATEGORIAS;
    const method = esEdicion ? 'PATCH' : 'POST';
    
    const bodyPayload = { descripcion: descripcion };
    if (!esEdicion) {
         bodyPayload.activo = 1; // Se requiere activo al crear.
    }

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

        const modalEl = document.getElementById('modalCategoria');
        if (modalEl) modalEl.style.display = 'none';

        if (!esEdicion) {
            // Si es una creación nueva, enviamos al usuario a la página 1 para que lo vea arriba del todo.
            await cargarCategorias(1);
        } else {
            // Si es edición, mantenemos la página actual.
            await cargarCategorias(paginaActual);
        }
        
    } catch (error) {
        console.error('Fallo al guardar la categoría:', error);
        alert('Hubo un error al procesar la categoría. Inténtalo de nuevo.');
    }
}

async function eliminarCategoria(id) {
    const confirmar = confirm(`¿Desea dar de baja la categoría ID ${id}?`);
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_API_CATEGORIAS}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);
        await cargarCategorias(paginaActual);
    } catch (e) {
        console.error('Fallo al eliminar categoría:', e);
        alert('Hubo un error al dar de baja la categoría.');
    }
}

async function reactivarCategoria(id) {
    const confirmar = confirm(`¿Desea reactivar la categoría ID ${id}?`);
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_API_CATEGORIAS}/${id}/reactivar`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);
        await cargarCategorias(paginaActual);
    } catch (e) {
        console.error('Fallo al reactivar categoría:', e);
        alert('Hubo un error al reactivar la categoría.');
    }
}

async function borradoDefinitivo(id) {
    const confirmar = confirm(`CUIDADO: ¿Desea ejecutar un BORRADO FÍSICO Y DEFINITIVO de la categoría ID ${id}?\n\nSi la categoría tiene artículos vinculados en la base de datos, esto lanzará un error para proteger tu información.`);
    if (!confirmar) return;

    try {
        const res = await fetch(`${URL_API_CATEGORIAS}/${id}/definitivo`, {
            method: 'DELETE'
        });
        
        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.error || `Error ${res.status}`);
        }
        
        await cargarCategorias(paginaActual);
    } catch (e) {
        console.error('Fallo al destruir categoría:', e);
        alert(`Hubo un error al destruirla definitivamente:\n${e.message}`);
    }
}
