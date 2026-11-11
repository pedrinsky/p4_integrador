import {pool} from '../config/db.js';

export class CategoriasRepository{
    static async getAll(input){
        const {id_categoria, descripcion, activo
            , order_column, direction, limit, offset} = input;

        const sql = `
            SELECT id_categoria, descripcion, activo, COUNT(*) OVER() as total_registros
            FROM categorias
            WHERE ($1::text IS NULL OR id_categoria = $1::int)
            AND ($2::text IS NULL OR descripcion ILIKE '%' || $2::text || '%')
            AND ($3::text IS NULL OR activo = $3::int)
            ORDER BY $4 ${direction}
            LIMIT $5 OFFSET $6;
        `;

        const {rows} = await pool.query(sql, [id_categoria ?? null, descripcion ?? null
            , activo ?? null, order_column, limit, offset]);

        return rows;
    }

    static async getByID(input){
        const {id_categoria} = input;
        const sql = `
            SELECT id_categoria, descripcion, activo
            FROM categorias
            WHERE id_categoria = $1;
        `;

        const {rows} = await pool.query(sql, [id_categoria]);
        return rows[0];

    }

    static async update(input){

        const {id_categoria, descripcion} = input;

        const sql = `
            UPDATE categorias
            SET descripcion = $1
            WHERE id_categoria = $2
            RETURNING *;
        `;

        const {rows} = await pool.query(sql, [descripcion, id_categoria]);
        return rows[0];
    }

    static async create(input){
        const {descripcion, activo} = input;

        const sql = `
            INSERT INTO categorias(descripcion, activo)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const {rows} = await pool.query(sql, [descripcion, activo]);
        return rows[0];
    }

    static async delete(input){

        const {id_categoria} = input;

        const sql = `
            UPDATE categorias
            SET activo = 0
            WHERE id_categoria = $1
            RETURNING *;
        `;

        const {rows} = await pool.query(sql, [id_categoria]);

        return rows[0];
        
    }
}