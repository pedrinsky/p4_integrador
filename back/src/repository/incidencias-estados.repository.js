import { pool } from "../config/db.js";

export class IncidenciasEstadosRepository {
    static async create(input) {
        console.log("Repository estados");
        const { id_incidencia, id_estado } = input;
        const sql = `
            INSERT INTO incidencias_estados (id_incidencia, id_estado)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const { rows } = await pool.query(sql, [id_incidencia, id_estado]);
        return rows[0];
    }
}