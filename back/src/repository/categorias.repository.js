import {pool} from '../config/db.js';

export class CategoriasRepository{
    static async getAll(input){
        console.log("Service");

        const {id_categoria, descripcion, activo
            , order_column, direction, limit, offset} = input;

        const sql = `
            SELECT id_categoria, descripcion, activo
            FROM categorias
            WHERE ($1::text IS NULL OR id_categoria = $1::int)
            AND ($2::text IS NULL OR descripcion ILIKE '%' || $2::text || '%')
            AND ($3::text IS NULL OR activo = $3::int)
            ORDER BY $4 ${direction}
            LIMIT $5 OFFSET $6;
        `;
        console.log(sql);

        const {rows} = await pool.query(sql, [id_categoria ?? null, descripcion ?? null
            , activo ?? null, order_column, limit, offset]);
        
        console.log(rows);

        return rows;
    }

    static async getByID(input){
        const {id_categoria} = input;
        console.log("Service");
        console.log(id_categoria);
        const sql = `
            SELECT id_categoria, descripcion, activo
            FROM categorias
            WHERE id_categoria = $1;
        `;

        console.log(sql);

        const {rows} = await pool.query(sql, [id_categoria]);
        console.log(rows);
        return rows[0];

    }

    static async update(input){
        console.log("service");
        console.log(input);

        const {id_categoria, descripcion} = input;
        console.log(id_categoria);

        const sql = `
            UPDATE categorias
            SET descripcion = $1
            WHERE id_categoria = $2
            RETURNING *;
        `
        console.log(sql);

        const {rows} = await pool.query(sql, [descripcion, id_categoria]);
        console.log(rows);
        return rows[0];
    }

    static async create(input){
        console.log("Service");
        const {descripcion, activo} = input;

        const sql = `
            INSERT INTO categorias(descripcion, activo)
            VALUES ($1, $2)
            RETURNING *;
        `;
        console.log(sql);
        const {rows} = await pool.query(sql, [descripcion, activo]);
        console.log(rows);
        return rows[0];
    }

    static async delete(input){
        console.log("Service");

        const {id_categoria} = input;
        console.log(id_categoria);

        const sql = `
            UPDATE categorias
            SET activo = 0
            WHERE id_categoria = $1
            RETURNING *;
        `;
        console.log(sql);

        const {rows} = await pool.query(sql, [id_categoria]);
        console.log(rows);

        return rows[0];
        
    }
}