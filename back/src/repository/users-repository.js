import { pool } from "../config/db.js";

export class User {

    static async getByUsername(usuario) {
        const sql = `SELECT * FROM usuarios WHERE usuario ILIKE $1 AND activo = 1;`;
        const { rows } = await pool.query(sql, [usuario]);
        return rows;
    }

    static async getAll(input = {}) {
        const sql = `SELECT id_usuario, id_area, nombres, apellidos, usuario, avatar, rol, activo 
                     FROM usuarios 
                     ORDER BY id_usuario ASC;`;
        const { rows } = await pool.query(sql);
        return rows;
    }

    static async findAll() {
        return this.getAll();
    }

    static async getByID(input) {
        const id = typeof input === 'object' ? (input.id_usuario ?? input.id) : input;
        const sql = `SELECT id_usuario, id_area, nombres, apellidos, usuario, avatar, rol, activo 
                     FROM usuarios 
                     WHERE id_usuario = $1;`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async getById(id) {
        return this.getByID(id);
    }

    static async findById(userId) {
        return this.getByID(userId);
    }

    static async findByUsernamePassword(username, contrasenia) {
        const sql = `SELECT id_usuario, id_area, nombres, apellidos, usuario, avatar, rol, activo
                     FROM usuarios
                     WHERE usuario ILIKE $1 
                     AND contrasenia = encode(digest($2, 'sha256'), 'hex')
                     AND activo = 1;`;
        const { rows } = await pool.query(sql, [username, contrasenia]);
        return rows[0];
    }

    static async create(input) {
        const {
            id_area = 1,
            nombres = input.nombre || '',
            apellidos = input.apellido || '',
            usuario = input.nombre_usuario || '',
            contrasenia,
            avatar = '',
            rol = 2,
            activo = 1
        } = input;

        const sql = `
            INSERT INTO usuarios (id_area, nombres, apellidos, usuario, contrasenia, avatar, rol, activo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id_usuario, id_area, nombres, apellidos, usuario, avatar, rol, activo;
        `;
        const { rows } = await pool.query(sql, [id_area, nombres, apellidos, usuario, contrasenia, avatar, rol, activo]);
        return rows[0];
    }

    static async update(id, input) {
        const targetId = typeof id === 'object' ? (id.id_usuario ?? id.id) : id;
        const data = typeof id === 'object' && !input ? id : input;
        const {
            nombres = data.nombre,
            apellidos = data.apellido,
            usuario = data.nombre_usuario,
            contrasenia = data.contrasenia,
            activo = data.activo
        } = data;

        const sql = `
            UPDATE usuarios
            SET nombres = COALESCE($1, nombres),
                apellidos = COALESCE($2, apellidos),
                usuario = COALESCE($3, usuario),
                contrasenia = COALESCE($4, contrasenia),
                activo = COALESCE($5, activo)
            WHERE id_usuario = $6
            RETURNING id_usuario, id_area, nombres, apellidos, usuario, avatar, rol, activo;
        `;
        const { rows } = await pool.query(sql, [nombres ?? null, apellidos ?? null, usuario ?? null, contrasenia ?? null, activo ?? null, targetId]);
        return rows[0];
    }

    static async delete(input) {
        const id = typeof input === 'object' ? (input.id_usuario ?? input.id) : input;
        const sql = `UPDATE usuarios SET activo = 0 WHERE id_usuario = $1 RETURNING id_usuario;`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async eliminar(id) {
        return this.delete(id);
    }

    // Compatibilidad con instancias
    findByUsernamePassword(username, contrasenia) {
        return User.findByUsernamePassword(username, contrasenia);
    }

    findById(userId) {
        return User.findById(userId);
    }
}

export default User;