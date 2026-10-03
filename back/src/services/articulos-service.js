import { pool } from "../config/db.js";

export class ArticulosService{
    static async getAll({id_articulo, id_area, id_categoria, descripcion
        , activo, order_column, direction, limit, offset}){
        
        const sql = `
            SELECT art.id_articulo, art.id_area, art.id_categoria
            , art.descripcion, art.activo
            FROM articulos art
            WHERE ($1::text IS NULL OR art.id_articulo = $1)
            AND ($2::text IS NULL OR art.id_area = $2)
            AND ($3::text IS NULL OR art.id_categoria = $3)
            AND ($4::text IS NULL OR art.descripcion = $4)
            AND ($5::text IS NULL OR art.activo = $5)
            ORDER BY ${order_column} ${direction}
            LIMIT $6 OFFSET $7
        `;
        console.log(sql);
        
        return {Correcto: "OK"};
    }
}