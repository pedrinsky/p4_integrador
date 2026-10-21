import { pool } from '../config/db.js';

const TABLE_NAME = 'categorias';
const ID_COLUMN = 'id_categoria';

// BROWSE: Traer paginado con filtro de búsqueda
export const cargarCategorias = async ({ limit, offset, search, activo }) => {

    let condicion = 'WHERE activo = 1';
    if (activo !== undefined && (activo === 0 || activo === '0')) {
        condicion = 'WHERE activo = 0';
    }
    const params = []; //obj que guarda los parámetros

    if (search && search.trim() !== '') {
        params.push(`%${search.trim()}%`);
        condicion += ` AND descripcion ILIKE $${params.length}`;
    }

    // Conteo total bajo el mismo filtro
    const countSql = `SELECT COUNT(*) FROM ${TABLE_NAME} ${condicion};`;
    const countResult = await pool.query(countSql, params);
    const totalRegistros = parseInt(countResult.rows[0].count, 10);
    const limitInt = parseInt(limit) || 10;
    const totalPaginas = Math.ceil(totalRegistros / limitInt) || 1;

    // 2. Registros de la página
    params.push(limitInt);
    const limitPos = params.length;

    params.push(offset);
    const offsetPos = params.length;

    const sql = `
        SELECT 
            ${ID_COLUMN}, descripcion, activo
        FROM 
            ${TABLE_NAME}
            ${condicion}
        ORDER BY 
            ${ID_COLUMN} DESC
        LIMIT $${limitPos} OFFSET $${offsetPos};
    `;
    const { rows } = await pool.query(sql, params);

    return {
        categorias: rows,
        paginacion: {
            totalRegistros,
            totalPaginas,
            limitePorPagina: limitInt,
            paginaActual: (parseInt(offset || 0) / limitInt) + 1
        }
    };
};

// READ: Obtener una sola categoría por ID
export const readCategoria = async (id) => {
    const sql = `
        SELECT 
            ${ID_COLUMN}, descripcion, activo
        FROM 
            ${TABLE_NAME}
        WHERE 
            ${ID_COLUMN} = $1;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
};

// ADD: Crear una nueva categoría (activo = 1 por defecto)
export const crearCategoria = async ({ descripcion }) => {
    // Busca el id_categoria más bajo disponible (comenzando desde el 1)
    const findIdSql = `
        SELECT COALESCE(
            (SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM ${TABLE_NAME} WHERE ${ID_COLUMN} = 1)),
            (SELECT MIN(c1.${ID_COLUMN} + 1)
             FROM ${TABLE_NAME} c1
             LEFT JOIN ${TABLE_NAME} c2 ON c1.${ID_COLUMN} + 1 = c2.${ID_COLUMN}
             WHERE c2.${ID_COLUMN} IS NULL)
        ) as next_id;
    `;
    const resId = await pool.query(findIdSql);
    const nextId = resId.rows[0].next_id;

    const sql = `
        INSERT INTO ${TABLE_NAME} 
            (${ID_COLUMN}, descripcion, activo)
        VALUES 
            ($1, $2, 1)
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [nextId, descripcion]);
    return rows[0];
};

// EDIT: Actualizar datos de la categoría
export const editarCategoria = async (id, { descripcion }) => {
    const sql = `
        UPDATE 
            ${TABLE_NAME}
        SET 
            descripcion = $1
        WHERE 
            ${ID_COLUMN} = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [descripcion, id]);
    return rows[0] || null;
};

// DELETE: Borrado lógico (activo = 0)
export const borrarCategoria = async (id) => {
    const sql = `
        UPDATE 
            ${TABLE_NAME}
        SET 
            activo = 0
        WHERE 
            ${ID_COLUMN} = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
};

// REACTIVATE: Recuperar categoría
export const reactivarCategoria = async (id) => {
    const sql = `
        UPDATE 
            ${TABLE_NAME}
        SET 
            activo = 1
        WHERE 
            ${ID_COLUMN} = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
};

// HARD DELETE: Borrado Físico
export const borradoDefinitivoCategoria = async (id) => {
    const sql = `
        DELETE FROM 
            ${TABLE_NAME}
        WHERE 
            ${ID_COLUMN} = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
};