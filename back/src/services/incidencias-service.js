import { pool } from "../config/db.js";

export class IncidenciasService{
    static async getAll(input){
        console.log("Service");

        const {id_incidencia, id_articulo, id_estado, creado_por, asignado_a
            , creado, prioridad, descripcion_pedido, descripcion_resolucion
            , order_column, direction, limit, offset} = input;

        const sql = `
            SELECT i.id_incidencia, art.descripcion as articulo, e.descripcion as estado
            , creador.usuario as creado_por, asignado.usuario as asignado_a
            , i.creado, i.prioridad, i.descripcion_pedido, i.descripcion_resolucion
            FROM incidencias i
            INNER JOIN articulos art
            ON i.id_articulo = art.id_articulo
            INNER JOIN estados e
            ON i.id_estado = e.id_estado
            INNER JOIN usuarios creador
            ON i.creado_por = creador.id_usuario
            INNER JOIN usuarios asignado
            ON i.asignado_a = asignado.id_usuario

            WHERE ($1::text IS NULL OR i.id_incidencia = $1::int)
            AND ($2::text IS NULL OR i.id_articulo = $2::int)
            AND ($3::text IS NULL OR i.id_estado = $3::int)
            AND ($4::text IS NULL OR i.creado_por = $4::int)
            AND ($5::text IS NULL OR i.asignado_a = $5::int)
            AND ($6::text IS NULL OR i.creado::date = $6::date)
            AND ($7::text IS NULL OR i.prioridad = $7::int)
            AND ($8::text IS NULL OR i.descripcion_pedido ILIKE '%' || $8::text || '%')
            AND ($9::text IS NULL OR i.descripcion_resolucion ILIKE '%' || $9::text || '%')
            ORDER BY $10 ${direction}
            LIMIT $11 OFFSET $12;
        `;
        console.log(sql);

        const {rows} = await pool.query(sql, [id_incidencia ?? null, id_articulo ?? null
            , id_estado ?? null, creado_por ?? null, asignado_a ?? null, creado ?? null
            , prioridad ?? null, descripcion_pedido ?? null, descripcion_resolucion ?? null
            , order_column, limit, offset]);
        
        console.log(rows);

        return rows;
    }

    static async getByID(input){
        console.log("Service");

        const {id_incidencia} = input;

        const sql = `
            SELECT i.id_incidencia, art.descripcion as articulo, e.descripcion as estado
            , creador.usuario as creado_por, asignado.usuario as asignado_a
            , i.creado, i.prioridad, i.descripcion_pedido, i.descripcion_resolucion
            FROM incidencias i
            INNER JOIN articulos art
            ON i.id_articulo = art.id_articulo
            INNER JOIN estados e
            ON i.id_estado = e.id_estado
            INNER JOIN usuarios creador
            ON i.creado_por = creador.id_usuario
            INNER JOIN usuarios asignado
            ON i.asignado_a = asignado.id_usuario
            WHERE ($1::text IS NULL OR id_incidencia = $1::int);
        `;
        console.log(sql);

        const {rows} = await pool.query(sql, [id_incidencia]);
        
        console.log(rows);

        return rows;
    }

    static async update(input){
        console.log("service");
        console.log(input);

        const {id_incidencia, ...entradas} = input;
        console.log(id_incidencia);
        console.log(entradas);

        const cambios = [];
        const valores = [id_incidencia];

        for(let campo in entradas){
            valores.push(entradas[campo]);
            cambios.push(` ${campo} = $${valores.length}`);
        }
        const sql = `
            UPDATE incidencias
            SET ${cambios.join(", ")}
            WHERE id_incidencia = $1
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
        const {id_articulo, creado_por, asignado_a, prioridad, descripcion_pedido} = input;

        const sql = `
            INSERT INTO incidencias(id_articulo, id_estado, creado_por, asignado_a, prioridad, creado, descripcion_pedido, descripcion_resolucion)
            VALUES ($1, 1, $2, -1, -1, NOW()::TIMESTAMPTZ, $3, '')
            RETURNING *;
        `;
        console.log(sql);
        const {rows} = await pool.query(sql, [id_articulo, creado_por, descripcion_pedido]);
        console.log(rows);
        return rows;
    }

    static async delete(input){
        console.log("Service");

        const {id_incidencia} = input;
        console.log(id_incidencia);

        const sql = `
            UPDATE incidencias
            SET id_estado = 4
            WHERE id_incidencia = $1
            RETURNING *;
        `;
        console.log(sql);

        const {rows} = await pool.query(sql, [id_incidencia]);
        console.log(rows);

        return rows;
        
    }

}