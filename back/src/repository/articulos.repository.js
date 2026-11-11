import { pool } from "../config/db.js";

export class ArticulosRepository{

    static async getAll(input = {}){

        const {id_articulo, id_area, id_categoria, descripcion
            , activo, order_column = 'id_articulo', direction = 'asc', limit = 5, offset = 0} = input;

        const validColumns = {
            id_articulo: 'art.id_articulo',
            id_area: 'art.id_area',
            id_categoria: 'art.id_categoria',
            area: 'a.descripcion',
            categoria: 'c.descripcion',
            descripcion: 'art.descripcion',
            activo: 'art.activo'
        };
        const col = validColumns[order_column] || 'art.id_articulo';
        const dir = String(direction).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        const sql = `
            SELECT art.id_articulo, art.id_area, a.descripcion as area, art.id_categoria, c.descripcion as categoria
            , art.descripcion, art.activo
            , COUNT(*) OVER() as total_registros
            FROM articulos art 
            LEFT JOIN areas a
            ON art.id_area = a.id_area
            LEFT JOIN categorias c
            ON art.id_categoria = c.id_categoria
            WHERE ($1::text IS NULL OR art.id_articulo = $1::int)
            AND ($2::text IS NULL OR art.id_area = $2::int)
            AND ($3::text IS NULL OR art.id_categoria = $3::int)
            AND ($4::text IS NULL OR art.descripcion ILIKE '%' || $4::text || '%')
            AND ($5::text IS NULL OR art.activo = $5::int)
            ORDER BY ${col} ${dir}
            LIMIT $6 OFFSET $7;
        `;

        const {rows} = await pool.query(sql, [id_articulo ?? null, id_area ?? null
            , id_categoria ?? null, descripcion ?? null, activo ?? null
            , limit, offset]);

        return rows;
    }

    static async getByID(input){
        const id = typeof input === 'object' && input !== null ? (input.id_articulo ?? input.id) : input;
        const sql = `
            SELECT art.id_articulo, art.id_area, a.descripcion as area, art.id_categoria, c.descripcion as categoria
            , art.descripcion, art.activo
            FROM articulos art 
            LEFT JOIN areas a
            ON art.id_area = a.id_area
            LEFT JOIN categorias c
            ON art.id_categoria = c.id_categoria
            WHERE art.id_articulo = $1;
        `;

        const {rows} = await pool.query(sql, [id]);
        return rows[0];

    }

    static async update(input){
        const {id_articulo, ...entradas} = input;

        const cambios = [];
        const valores = [id_articulo];

        for(let campo in entradas){
            valores.push(entradas[campo]);
            cambios.push(` ${campo} = $${valores.length}`);
        }
        const sql = `
            UPDATE articulos
            SET ${cambios.join(", ")}
            WHERE id_articulo = $1
            RETURNING *;
        `
        const {rows} = await pool.query(sql, valores);
        return rows[0];
    }

    static async create(input){
        const {id_area, id_categoria, descripcion, activo} = input;

        const sql = `
            INSERT INTO articulos(id_area, id_categoria, descripcion, activo)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const {rows} = await pool.query(sql, [id_area, id_categoria, descripcion, activo]);
        return rows[0];
    }

    static async delete(input){

        const {id_articulo} = input;

        const sql = `
            UPDATE articulos
            SET activo = 0
            WHERE id_articulo = $1
            RETURNING *;
        `;

        const {rows} = await pool.query(sql, [id_articulo]);

        return rows[0];
        
    }

    static async reactivar(input){
        const id = typeof input === 'object' && input !== null ? (input.id_articulo ?? input.id) : input;

        const sql = `
            UPDATE articulos
            SET activo = 1
            WHERE id_articulo = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(sql, [id]);
        return rows[0];
    }

    static async eliminarDefinitivo(input){
        const id = typeof input === 'object' && input !== null ? (input.id_articulo ?? input.id) : input;

        const sql = `
            DELETE FROM articulos
            WHERE id_articulo = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(sql, [id]);
        return rows[0];
    }
}