import { pool } from "../config/db.js";

export class IncidenciasEstadosRepository{
    static async create(input){
        console.log("Repository");
        const { id_incidencia, id_estado } = input;

        const sql = `
            INSERT INTO incidencias_estados(id_incidencia, id_estado, fecha_hora_estado)
            VALUES ($1, $2, NOW()::TIMESTAMPTZ)
            RETURNING *;
        `;
        console.log(sql);
        const {rows} = await pool.query(sql, [id_incidencia, id_estado]);
        console.log(rows);
        return rows;

    }
}