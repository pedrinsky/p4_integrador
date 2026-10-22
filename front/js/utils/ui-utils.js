/**
 * Crea un elemento <span> con una clase badge de forma segura (sin innerHTML).
 * @param {string} texto  Texto a mostrar dentro del badge
 * @param {string} clase  Clase CSS del badge (ej: 'est-pendiente')
 * @returns {HTMLSpanElement}
 */
function crearBadge(texto, clase) {
    const span = document.createElement('span');
    span.className = `badge ${clase}`;
    span.textContent = texto;
    return span;
}

/**
 * Inserta un badge en una celda <td> de forma segura.
 * Equivalente seguro a: td.innerHTML = badgesEstado[x]
 * @param {HTMLTableCellElement} td
 * @param {HTMLSpanElement|Function|string|number} badge
 */
export function insertarBadge(td, badge) {
    if (!td) return;
    td.textContent = '';
    if (typeof badge === 'function') {
        td.appendChild(badge());
    } else if (badge instanceof Node) {
        td.appendChild(badge);
    } else if (badge !== null && badge !== undefined) {
        td.textContent = String(badge);
    }
}

// Mapas de badges de estado y prioridad como funciones que crean elementos DOM
export const badgesEstado = {
    1: () => crearBadge('Pendiente',  'est-pendiente'),
    2: () => crearBadge('En Proceso', 'est-proceso'),
    3: () => crearBadge('Resuelta',   'est-resuelta'),
    4: () => crearBadge('Cancelada',  'est-cancelada'),
    'Pendiente': () => crearBadge('Pendiente',  'est-pendiente'),
    'En Proceso': () => crearBadge('En Proceso', 'est-proceso'),
    'Resuelta': () => crearBadge('Resuelta',   'est-resuelta'),
    'Resuela': () => crearBadge('Resuelta',   'est-resuelta'),
    'Cancelada': () => crearBadge('Cancelada',  'est-cancelada')
};

export const badgesPrioridad = {
    1: () => crearBadge('Baja',  'prio-baja'),
    2: () => crearBadge('Media', 'prio-media'),
    3: () => crearBadge('Alta',  'prio-alta'),
    'Baja': () => crearBadge('Baja',  'prio-baja'),
    'Media': () => crearBadge('Media', 'prio-media'),
    'Alta': () => crearBadge('Alta',  'prio-alta')
};

/**
 * Renderiza la UI de los botones de paginación
 * @param {Object} pagObj Objeto de paginación devuelto por el Backend ({ totalPaginas, paginaActual })
 * @param {String} contenedorID ID del contenedor ul del DOM
 * @param {Function} callbackFiltro Función a invocar cuando se hace clic en una pág (recibe el integer de la pagina solicitada)
 */
export function renderizarPaginacion(pagObj, contenedorID, callbackFiltro) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.textContent = '';

    contenedor.style.display = 'flex';
    contenedor.style.listStyle = 'none';
    contenedor.style.gap = '5px';
    contenedor.style.padding = '0';
    contenedor.style.justifyContent = 'center';
    contenedor.style.marginTop = '20px';

    const { totalPaginas, paginaActual } = pagObj;

    // Botón "Prev"
    const liPrev = document.createElement('li');
    const aPrev = document.createElement('a');
    aPrev.href = '#';
    aPrev.textContent = '« Prev';
    aPrev.style.cssText = `padding: 5px 10px; border: 1px solid #ccc; text-decoration: none; color: ${paginaActual === 1 ? '#aaa' : '#333'}; pointer-events: ${paginaActual === 1 ? 'none' : 'auto'};`;
    liPrev.appendChild(aPrev);
    liPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual > 1) callbackFiltro(paginaActual - 1);
    });
    contenedor.appendChild(liPrev);

    // Botones numerados
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = String(i);
        const isActive = (i === paginaActual);
        a.style.cssText = `padding: 5px 10px; border: 1px solid #ccc; text-decoration: none; color: ${isActive ? '#fff' : '#333'}; background-color: ${isActive ? '#5ca532' : 'transparent'};`;
        li.appendChild(a);
        const pagina = i;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            callbackFiltro(pagina);
        });
        contenedor.appendChild(li);
    }

    // Botón "Next"
    const liNext = document.createElement('li');
    const aNext = document.createElement('a');
    aNext.href = '#';
    aNext.textContent = 'Next »';
    aNext.style.cssText = `padding: 5px 10px; border: 1px solid #ccc; text-decoration: none; color: ${paginaActual === totalPaginas ? '#aaa' : '#333'}; pointer-events: ${paginaActual === totalPaginas ? 'none' : 'auto'};`;
    liNext.appendChild(aNext);
    liNext.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual < totalPaginas) callbackFiltro(paginaActual + 1);
    });
    contenedor.appendChild(liNext);
}
