import { pool } from '../config/db.js';

const TABLE_NAME = 'categorias';
const ID_COLUMN = 'id_categoria';

// BROWSE: Traer paginado con filtro de búsqueda
export const cargarCategorias = async ({ limit, offset, search }) => {

    let condicion = 'WHERE activo = 1';
    const params = []; //obj que guarda los parámetros

    if (search && search.trim() !== '') {
        params.push(`%${search.trim()}%`);
        condicion += ` AND descripcion ILIKE $${params.length}`;
    }

    // Conteo total bajo el mismo filtro
    const countSql = `SELECT COUNT(*) FROM ${TABLE_NAME} ${condicion};`;
    const countResult = await pool.query(countSql, params);
    const totalRegistros = parseInt(countResult.rows[0].count, 10);

    // 2. Registros de la página
    params.push(limit);
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
            descripcion ASC
        LIMIT $${limitPos} OFFSET $${offsetPos};
    `;
    const { rows } = await pool.query(sql, params);

    return {
        categorias: rows,
        totalRegistros
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
    const sql = `
        INSERT INTO ${TABLE_NAME} 
            (descripcion, activo)
        VALUES 
            ($1, 1)
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [descripcion]);
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