import { pool } from '../config/db.js';

export class IncidenciasRepository {
    
    static async getAll(input = {}) {
        // Obtenemos los parámetros considerando la misma convención que categorías
        const { order_column = 'id_incidencia', direction = 'ASC', limit = 10, page = 1, estado, prioridad, search } = input;
        
        const limitInt = parseInt(limit, 10);
        const pageInt = parseInt(page, 10);
        const offset = (pageInt - 1) * limitInt;

        const params = [];
        let whereClauses = [];

        // Filtros (los pasamos del frontend a la DB)
        if (estado && estado !== '') {
            params.push(estado);
            whereClauses.push(`i.id_estado = $${params.length}`);
        } else if (input.exclude_estado && input.exclude_estado !== '') {
            params.push(input.exclude_estado);
            whereClauses.push(`i.id_estado != $${params.length}`);
        }
        
        if (prioridad && prioridad !== '') {
            params.push(prioridad);
            whereClauses.push(`i.prioridad = $${params.length}`);
        }

        if (search && search !== '') {
            params.push(`%${search}%`);
            whereClauses.push(`(CAST(i.id_incidencia AS TEXT) = $${params.length} OR i.descripcion_pedido ILIKE $${params.length} OR a.descripcion ILIKE $${params.length})`);
        }

        const whereCondition = whereClauses.length > 0 ? `WHERE ` + whereClauses.join(' AND ') : '';

        // 1. Contar el total de registros para paginación
        const countQuery = `
            SELECT COUNT(*) 
            FROM incidencias i
            LEFT JOIN articulos a ON i.id_articulo = a.id_articulo
            ${whereCondition}
        `;
        const countResult = await pool.query(countQuery, params);
        const totalRegistros = parseInt(countResult.rows[0].count, 10);
        const totalPaginas = Math.ceil(totalRegistros / limitInt) || 1;

        // 2. Traer los registros paginados
        // Añadir los parámetros de limit y offset al final array de parámetros
        params.push(limitInt);
        const limitPos = params.length;
        params.push(offset);
        const offsetPos = params.length;

        const result = await pool.query(`
            SELECT 
                i.id_incidencia,
                TO_CHAR(i.creado, 'DD/MM/YYYY') as creado,
                a.descripcion as articulo_descripcion,
                i.descripcion_pedido,
                i.prioridad,
                CONCAT(u.nombres, ' ', u.apellidos) as creado_por,
                i.id_estado
            FROM incidencias i
            LEFT JOIN articulos a ON i.id_articulo = a.id_articulo
            LEFT JOIN usuarios u ON i.creado_por = u.id_usuario
            ${whereCondition}
            ORDER BY ${order_column} ${direction === 'DESC' ? 'DESC' : 'ASC'}
            LIMIT $${limitPos} OFFSET $${offsetPos}
        `, params);
        
        return {
            incidencias: result.rows,
            paginacion: {
                totalRegistros,
                totalPaginas,
                paginaActual: pageInt,
                limitePorPagina: limitInt
            }
        };
    }

    static async getByID(input) {
        const { id_incidencia } = input;
        const result = await pool.query(`
            SELECT * FROM incidencias WHERE id_incidencia = $1
        `, [id_incidencia]);
        return result.rows;
    }

    static async create(input) {
        let { id_articulo, descripcion_pedido, prioridad, creado_por, id_estado } = input;
        
        // Defaults seguros
        id_estado = id_estado || 1;
        creado_por = creado_por || 1;
        prioridad = prioridad || 1;

        const result = await pool.query(`
            INSERT INTO incidencias (id_articulo, descripcion_pedido, prioridad, creado_por, id_estado)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [id_articulo || null, descripcion_pedido, prioridad, creado_por, id_estado]);
        return result.rows;
    }

    static async update(input) {
        const { id_incidencia, id_estado, descripcion_resolucion } = input;
        const result = await pool.query(`
            UPDATE incidencias 
            SET id_estado = COALESCE($2, id_estado),
                descripcion_resolucion = COALESCE($3, descripcion_resolucion)
            WHERE id_incidencia = $1
            RETURNING *;
        `, [id_incidencia, id_estado, descripcion_resolucion]);
        return result.rows;
    }

    static async finalizarIncidencia(id_incidencia, descripcionResolucion) {
        await pool.query(`
            UPDATE incidencias 
            SET id_estado = 3,
                descripcion_resolucion = $2
            WHERE id_incidencia = $1
        `, [id_incidencia, descripcionResolucion]);
        return [];
    }

    static async reabrirIncidencia(id_incidencia) {
        await pool.query(`
            UPDATE incidencias 
            SET id_estado = 1,
                descripcion_resolucion = NULL
            WHERE id_incidencia = $1
        `, [id_incidencia]);
        return [];
    }

    static async delete(input) {
        const { id_incidencia } = input;
        const result = await pool.query(`
            UPDATE incidencias
            SET id_estado = 4
            WHERE id_incidencia = $1
            RETURNING *;
        `, [id_incidencia]);
        return result.rows;
    }
}
