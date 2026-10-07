import { pool } from "../config/db.js";

export class ArticulosService{

    static async getAll(input){
        console.log("Service");

        const {id_articulo, id_area, id_categoria, descripcion
            , activo, order_column, direction, limit, offset} = input;

        const limitInt = parseInt(limit || 10);
        const pageInt = parseInt(input.page || 1);
        const calcOffset = (pageInt - 1) * limitInt;

        // Query count for paginacion
        const countSql = `
            SELECT COUNT(*)
            FROM articulos art 
            WHERE ($1::text IS NULL OR art.id_articulo = $1::int)
            AND ($2::text IS NULL OR art.id_area = $2::int)
            AND ($3::text IS NULL OR art.id_categoria = $3::int)
            AND ($4::text IS NULL OR art.descripcion ILIKE '%' || $4::text || '%')
            AND ($5::text IS NULL OR art.activo = $5::int)
        `;
        const countRes = await pool.query(countSql, [id_articulo ?? null, id_area ?? null, id_categoria ?? null, descripcion ?? null, activo ?? null]);
        const totalRegistros = parseInt(countRes.rows[0].count, 10);
        const totalPaginas = Math.ceil(totalRegistros / limitInt) || 1;

        const sql = `
            SELECT art.id_articulo, a.descripcion as area, c.descripcion as categoria
            , art.descripcion, art.activo, art.id_area, art.id_categoria
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
            ORDER BY art.activo DESC, id_articulo ASC
            LIMIT $6 OFFSET $7;
        `;

        const {rows} = await pool.query(sql, [id_articulo ?? null, id_area ?? null
            , id_categoria ?? null, descripcion ?? null, activo ?? null
            , limitInt, calcOffset]);
        
        return {
            articulos: rows,
            paginacion: {
                totalRegistros,
                totalPaginas,
                limitePorPagina: limitInt,
                paginaActual: pageInt
            }
        };
    }

    static async getByID(input){
        const {id_articulo} = input;
        const sql = `
            SELECT art.id_articulo, a.descripcion as area, c.descripcion as categoria
            , art.descripcion, art.activo, art.id_area, art.id_categoria
            FROM articulos art 
            INNER JOIN areas a
            ON art.id_area = a.id_area
            INNER JOIN categorias c
            ON art.id_categoria = c.id_categoria
            WHERE id_articulo = $1;
        `;
        const {rows} = await pool.query(sql, [id_articulo]);
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
        const {id_area, id_categoria, descripcion, activo} = input;
        
        // Gap-filling logic para re-utilizar IDs eliminados físicamente
        const gapSql = `
            SELECT MIN(generate_series)::int as unused_id 
            FROM generate_series(1, COALESCE((SELECT MAX(id_articulo) + 1 FROM articulos), 1)) 
            WHERE generate_series NOT IN (SELECT id_articulo FROM articulos)
        `;
        const gapRes = await pool.query(gapSql);
        const nuevoId = gapRes.rows[0].unused_id || 1;

        const sql = `
            INSERT INTO articulos(id_articulo, id_area, id_categoria, descripcion, activo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const {rows} = await pool.query(sql, [nuevoId, id_area, id_categoria, descripcion, activo]);
        return rows;
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
        return rows;
    }

    static async reactivar(input){
        const {id_articulo} = input;
        const sql = `
            UPDATE articulos
            SET activo = 1
            WHERE id_articulo = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(sql, [id_articulo]);
        return rows;
    }

    static async eliminarDefinitivo(input){
        const {id_articulo} = input;
        const sql = `
            DELETE FROM articulos
            WHERE id_articulo = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(sql, [id_articulo]);
        return rows;
    }
}