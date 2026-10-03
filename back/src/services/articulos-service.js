import { pool } from "../config/db.js";

export class ArticulosService{
    static async getAll(input){
        const {order_column, asc, limit, offset, ...entradas} = input;

        const direction  = asc ? "ASC" : "DESC";

        console.log("entradas: ", entradas);
        const condiciones = [];
        const valores = [order_column, limit, offset];

        for(let column in entradas){
            valores.push(entradas[column]);
            if(column === "descripcion"){
                condiciones.push(`descripcion ILIKE '%'||$${valores.length}||'%'`);
                continue
            }
            condiciones.push(`${column} = $${valores.length}`);
        }

        let sql;

        if(condiciones.length === 0){
            sql = `
                SELECT id_articulo, id_area, id_categoria
                , descripcion, activo
                FROM articulos
                ORDER BY $1 ${direction}
                LIMIT $2 OFFSET $3;
            `;
            
            console.log(sql);
            console.log(valores);
        }else{
            sql = `
                SELECT id_articulo, id_area, id_categoria
                , descripcion, activo
                FROM articulos
                WHERE ${condiciones.join(" AND ")}
                ORDER BY $1 ${direction}
                LIMIT $2 OFFSET $3;
            `;
            console.log(sql);
            console.log(valores);
        }

        const {rows} = await pool.query(sql, valores);
        
        console.log(rows);

        return rows;
    }

    static async getByID(input){
        const {id_articulo} = input;
        console.log("Service");
        console.log(id_articulo);
        const sql = `
            SELECT id_articulo, id_area, id_categoria, descripcion, activo
            FROM articulos
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

}