import { pool } from "../config/db.js";

export class ArticulosService{
    // static async getAll({id_articulo, id_area, id_categoria, descripcion
    //     , activo, order_column, direction, limit, offset}){
        
    //     const sql = `
    //         SELECT art.id_articulo, art.id_area, art.id_categoria
    //         , art.descripcion, art.activo
    //         FROM articulos art
    //         WHERE ($1::text IS NULL OR art.id_articulo = $1)
    //         AND ($2::text IS NULL OR art.id_area = $2)
    //         AND ($3::text IS NULL OR art.id_categoria = $3)
    //         AND ($4::text IS NULL OR art.descripcion = $4)
    //         AND ($5::text IS NULL OR art.activo = $5)
    //         ORDER BY ${order_column} ${direction}
    //         LIMIT $6 OFFSET $7
    //     `;
    //     console.log(sql);
        
    //     const {rows} = await pool.query(sql, [id_articulo ?? null, id_area ?? null
    //         , id_categoria ?? null, descripcion ?? null, activo ?? null
    //         , limit ?? null, offset ?? null])
        
    //     console.log(rows);

    //     return rows;
    // }

    static async getAll(input){
        const {order_column, asc, limit, offset, ...entradas} = input;

        const direction  = asc ? "ASC" : "DESC";

        console.log("entradas: ", entradas);
        const condiciones = [];
        const valores = [order_column, limit, offset];

        for(let column in entradas){
            valores.push(entradas[column]);
            condiciones.push(`${column} = $${valores.length}`);
        }

        const sql = `
            SELECT id_articulo, id_area, id_categoria
            , descripcion, activo
            FROM articulos
            WHERE ${condiciones.join(" AND ")}
            ORDER BY $1 ${direction}
            LIMIT $2 OFFSET $3;
        `;
        console.log(sql);
        console.log(valores);
        
        const {rows} = await pool.query(sql, valores);
        
        console.log(rows);

        return rows;
    }

}