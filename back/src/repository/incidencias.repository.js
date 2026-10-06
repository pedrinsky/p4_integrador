import { pool } from '../config/db.js';

export class IncidenciasRepository {
    
    static async getAll(input = {}) {
        const { order_column = 'id_incidencia', direction = 'ASC', limit = 100, offset = 0 } = input;
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
            ORDER BY $1 ${direction === 'DESC' ? 'DESC' : 'ASC'}
            LIMIT $2 OFFSET $3
        `, [order_column, limit, offset]);
        return result.rows;
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
