export const badgesEstado = {
    1: '<span class="badge est-pendiente">Pendiente</span>',
    2: '<span class="badge est-proceso">En Proceso</span>',
    3: '<span class="badge est-resuelta">Resuelta</span>',
    4: '<span class="badge est-cancelada">Cancelada</span>'
};

export const badgesPrioridad = {
    1: '<span class="badge prio-baja">Baja</span>',
    2: '<span class="badge prio-media">Media</span>',
    3: '<span class="badge prio-alta">Alta</span>'
};

/**
 * Renderiza la UI de los botones de paginación
 * @param {Object} pagObj Objeto de paginación devuelto por el Backend ({ totalPaginas, paginaActual })
 * @param {String} contenedorID ID del contenedor ul del DOM
 * @param {Function} callbackFiltro Función a incovar cuando se hace clic en una pág (recibe el integer de la pagina solicitada)
 */
export function renderizarPaginacion(pagObj, contenedorID, callbackFiltro) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return;
    contenedor.innerHTML = '';
    
    // Estilos puros nativos mediante flexbox
    contenedor.style.display = 'flex';
    contenedor.style.listStyle = 'none';
    contenedor.style.gap = '5px';
    contenedor.style.padding = '0';
    contenedor.style.justifyContent = 'center';
    contenedor.style.marginTop = '20px';

    const { totalPaginas, paginaActual } = pagObj;
    
    // Boton "Prec"
    const liPrev = document.createElement('li');
    const isPrevDisabled = paginaActual === 1;
    liPrev.innerHTML = `<a href="#" style="padding: 5px 10px; border: 1px solid #ccc; text-decoration: none; color: ${isPrevDisabled ? '#aaa' : '#333'}; pointer-events: ${isPrevDisabled ? 'none' : 'auto'};">&laquo; Prev</a>`;
    liPrev.onclick = (e) => {
        e.preventDefault();
        if (paginaActual > 1) {
            callbackFiltro(paginaActual - 1);
        }
    };
    contenedor.appendChild(liPrev);

    // Botones numerados
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        const isActive = (i === paginaActual);
        
        li.innerHTML = `<a href="#" style="padding: 5px 10px; border: 1px solid #ccc; text-decoration: none; color: ${isActive ? '#fff' : '#333'}; background-color: ${isActive ? '#5ca532' : 'transparent'};">${i}</a>`;
        
        li.onclick = (e) => {
            e.preventDefault();
            callbackFiltro(i);
        };
        contenedor.appendChild(li);
    }

    // Boton "Next"
    const liNext = document.createElement('li');
    const isNextDisabled = paginaActual === totalPaginas;
    liNext.innerHTML = `<a href="#" style="padding: 5px 10px; border: 1px solid #ccc; text-decoration: none; color: ${isNextDisabled ? '#aaa' : '#333'}; pointer-events: ${isNextDisabled ? 'none' : 'auto'};">Next &raquo;</a>`;
    liNext.onclick = (e) => {
        e.preventDefault();
        if (paginaActual < totalPaginas) {
            callbackFiltro(paginaActual + 1);
        }
    };
    contenedor.appendChild(liNext);
}
