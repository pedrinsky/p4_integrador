import {pool} from '../config/db.js'

export const findAll = async (tableName) => {
    return await pool.query(`SELECT * FROM ${tableName}`);
}

export const findById = async (tableName, idColumn, id) => {
    const text = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
    return await pool.query(text, [id]);
}

export const findActives = async (tableName, activeCondition = 'activo = 1') => {
    return await pool.query(`SELECT * FROM ${tableName} WHERE ${activeCondition}`);
}

export const findActivesById = async (tableName, idColumn, id, activeCondition = 'activo = 1') => {
    const text = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1 AND ${activeCondition}`;
    return await pool.query(text, [id]);
}

function renderizarPaginacion(paginacion, idContenedor, callbackCarga) {
    /*paginacion: El objeto con totalPaginas y paginaActual.

    idContenedor: El id del <ul class="pagination"> que querés rellenar (en formato texto).

    callbackCarga: La función que debe ejecutarse al cambiar de página (cargarIncidencias en este caso).
    */
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    contenedor.innerHTML = '';
    const { totalPaginas, paginaActual } = paginacion;
    if (totalPaginas <= 1) return;

    // Anterior
    const liAnterior = document.createElement('li');
    liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    liAnterior.innerHTML = `<button class="page-link">Anterior</button>`;
    if (paginaActual > 1) {
        liAnterior.addEventListener('click', () => callbackCarga(paginaActual - 1));
    }
    contenedor.appendChild(liAnterior);

    // Números
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
        
        const btn = document.createElement('button');
        btn.className = 'page-link';
        btn.textContent = i;
        btn.addEventListener('click', () => {
            if (i !== paginaActual) callbackCarga(i);
        });

        li.appendChild(btn);
        contenedor.appendChild(li);
    }

    // Siguiente
    const liSiguiente = document.createElement('li');
    liSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    liSiguiente.innerHTML = `<button class="page-link">Siguiente</button>`;
    if (paginaActual < totalPaginas) {
        liSiguiente.addEventListener('click', () => callbackCarga(paginaActual + 1));
    }
    contenedor.appendChild(liSiguiente);
}

// FORMATEAR FECHA
function formatearFecha(fechaCruda) {
    if (!fechaCruda) return '-';
    const fecha = new Date(fechaCruda);
    if (isNaN(fecha.getTime())) return fechaCruda; // Si ya viene formateada desde SQL, la deja igual

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const mins = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}-${mes}-${anio} ${horas}:${mins}`;
}