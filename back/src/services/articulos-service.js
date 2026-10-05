import { pool } from "../config/db.js";

export class ArticulosService{

    // static async getAll(input){
    //     console.log("Service");

    //     const {id_articulo, id_area, id_categoria, descripcion
    //         , activo, order_column, direction, limit, offset} = input;

    //     const sql = `
    //         SELECT id_articulo, id_area, id_categoria, descripcion, activo
    //         FROM articulos
    //         WHERE ($1::text IS NULL OR id_articulo = $1::int)
    //         AND ($2::text IS NULL OR id_area = $2::int)
    //         AND ($3::text IS NULL OR id_categoria = $3::int)
    //         AND ($4::text IS NULL OR descripcion ILIKE '%' || $4::text || '%')
    //         AND ($5::text IS NULL OR activo = $5::int)
    //         ORDER BY $6 ${direction}
    //         LIMIT $7 OFFSET $8;
    //     `;
    //     console.log(sql);

    //     const {rows} = await pool.query(sql, [id_articulo ?? null, id_area ?? null
    //         , id_categoria ?? null, descripcion ?? null, activo ?? null, order_column
    //         , limit, offset]);
        
    //     console.log(rows);

    //     return rows;
    // }

    static async getAll(input){
        console.log("Service");

        const {id_articulo, id_area, id_categoria, descripcion
            , activo, order_column, direction, limit, offset} = input;

        const sql = `
            SELECT art.id_articulo, a.descripcion as area, c.descripcion as categoria
            , art.descripcion, art.activo
            FROM articulos art 
            INNER JOIN areas a
            ON art.id_area = a.id_area
            INNER JOIN categorias c
            ON art.id_categoria = c.id_categoria
            WHERE ($1::text IS NULL OR art.id_articulo = $1::int)
            AND ($2::text IS NULL OR art.id_area = $2::int)
            AND ($3::text IS NULL OR art.id_categoria = $3::int)
            AND ($4::text IS NULL OR art.descripcion ILIKE '%' || $4::text || '%')
            AND ($5::text IS NULL OR art.activo = $5::int)
            ORDER BY $6 ${direction}
            LIMIT $7 OFFSET $8;
        `;
        console.log(sql);

        const {rows} = await pool.query(sql, [id_articulo ?? null, id_area ?? null
            , id_categoria ?? null, descripcion ?? null, activo ?? null, order_column
            , limit, offset]);
        
        console.log(rows);

        return rows;
    }

    // static async getByID(input){
    //     const {id_articulo} = input;
    //     console.log("Service");
    //     console.log(id_articulo);
    //     const sql = `
    //         SELECT id_articulo, id_area, id_categoria, descripcion, activo
    //         FROM articulos
    //         WHERE id_articulo = $1;
    //     `;

    //     console.log(sql);

    //     const {rows} = await pool.query(sql, [id_articulo]);
    //     console.log(rows);
    //     return rows;

    // }

    static async getByID(input){
        const {id_articulo} = input;
        console.log("Service");
        console.log(id_articulo);
        const sql = `
            SELECT art.id_articulo, a.descripcion as area, c.descripcion as categoria
            , art.descripcion, art.activo
            FROM articulos art 
            INNER JOIN areas a
            ON art.id_area = a.id_area
            INNER JOIN categorias c
            ON art.id_categoria = c.id_categoria
            WHERE id_articulo = $1;
        `;

        console.log(sql);

        const {rows} = await pool.query(sql, [id_articulo]);
        console.log(rows);
        return rows;

    }

    static async update(input){
        console.log("service");
        console.log(input);

        const {id_articulo, ...entradas} = input;
        console.log(id_articulo);
        console.log(entradas);

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
        console.log(sql);
        console.log(valores);

        const {rows} = await pool.query(sql, valores);
        console.log(rows);
        return rows;
    }

    static async create(input){
        console.log("Service");
        const {id_area, id_categoria, descripcion, activo} = input;

        const sql = `
            INSERT INTO articulos(id_area, id_categoria, descripcion, activo)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        console.log(sql);
        const {rows} = await pool.query(sql, [id_area, id_categoria, descripcion, activo]);
        console.log(rows);
        return rows;
    }

    static async delete(input){
        console.log("Service");

        const {id_articulo} = input;
        console.log(id_articulo);

        const sql = `
            UPDATE articulos
            SET activo = 2
            WHERE id_articulo = $1
            RETURNING *;
        `;
        console.log(sql);

        const {rows} = await pool.query(sql, [id_articulo]);
        console.log(rows);

        return rows;
        
    }
}