import { pool } from "../config/db.js";

export class NotificacionesRepository {
    static async initTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS notificaciones (
                id_notificacion SERIAL PRIMARY KEY,
                id_usuario INT NOT NULL,
                id_incidencia INT,
                mensaje TEXT NOT NULL,
                leida SMALLINT DEFAULT 0,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        try {
            await pool.query(sql);
        } catch (error) {
            console.error("Error al inicializar tabla notificaciones:", error);
        }
    }

    static async create({ id_usuario, id_incidencia = null, mensaje }) {
        await this.initTable();

        let idNum = parseInt(id_usuario, 10);
        if (isNaN(idNum) && typeof id_usuario === 'string') {
            // Resolver id por nombre de usuario / email si se pasó como string
            const resUser = await pool.query("SELECT id_usuario FROM usuarios WHERE usuario ILIKE $1 LIMIT 1;", [id_usuario]);
            idNum = resUser.rows[0]?.id_usuario;
        }

        if (!idNum) {
            console.warn('[NotificacionesRepository] No se pudo determinar el id_usuario para la notificación:', id_usuario);
            return null;
        }

        const sql = `
            INSERT INTO notificaciones (id_usuario, id_incidencia, mensaje)
            VALUES ($1, $2, $3)
            RETURNING id_notificacion, id_usuario, id_incidencia, mensaje, leida, creado;
        `;
        const { rows } = await pool.query(sql, [idNum, id_incidencia, mensaje]);
        return rows[0];
    }

    static async getByUsuario(id_usuario) {
        await this.initTable();
        const sql = `
            SELECT id_notificacion, id_usuario, id_incidencia, mensaje, leida, creado
            FROM notificaciones
            WHERE id_usuario = $1
            ORDER BY creado DESC
            LIMIT 25;
        `;
        const { rows } = await pool.query(sql, [id_usuario]);
        return rows;
    }

    static async contarNoLeidas(id_usuario) {
        await this.initTable();
        const sql = `
            SELECT COUNT(*)::int as total
            FROM notificaciones
            WHERE id_usuario = $1 AND leida = 0;
        `;
        const { rows } = await pool.query(sql, [id_usuario]);
        return rows[0]?.total ?? 0;
    }

    static async marcarTodasLeidas(id_usuario) {
        await this.initTable();
        const sql = `
            UPDATE notificaciones
            SET leida = 1
            WHERE id_usuario = $1 AND leida = 0;
        `;
        await pool.query(sql, [id_usuario]);
        return true;
    }
}

