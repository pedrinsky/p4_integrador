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

    static async getByID(input) {
        console.log("Repository");
        const id = typeof input === 'object' ? (input.id_usuario ?? input.id) : input;
        const sql = `SELECT u.id_usuario, u.id_area, ar.descripcion as area, 
                        u.nombres, u.apellidos, u.usuario, u.avatar, u.rol, u.activo
                     FROM usuarios u
                     LEFT JOIN areas ar ON ar.id_area = u.id_area  
                     WHERE u.id_usuario = $1::int
                     AND u.activo = 1;`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async findByUsernamePassword(input) {
        const { usuario, contrasenia } = input;
        console.log("Repository");
        const sql = `SELECT u.id_usuario, u.id_area, ar.descripcion as area, 
                        u.nombres, u.apellidos, u.usuario, u.avatar, u.rol, u.activo
                     FROM usuarios u
                     LEFT JOIN areas ar ON ar.id_area = u.id_area  
                     WHERE u.usuario ILIKE $1 
                     AND u.contrasenia = encode(sha256($2::bytea), 'hex')
                     AND u.activo = 1;`;
        console.log(sql);
        const { rows } = await pool.query(sql, [usuario, contrasenia]);
        console.log(rows);
        return rows[0];
    }

    // static async create(input) {
    //     const {
    //         id_area = 1,
    //         nombres = input.nombre || '',
    //         apellidos = input.apellido || '',
    //         usuario = input.nombre_usuario || '',
    //         contrasenia,
    //         avatar = '',
    //         rol = 2,
    //         activo = 1
    //     } = input;

    //     const sql = `
    //         INSERT INTO usuarios (id_area, nombres, apellidos, usuario, contrasenia, avatar, rol, activo)
    //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    //         RETURNING id_usuario, id_area, nombres, apellidos, usuario, avatar, rol, activo;
    //     `;
    //     const { rows } = await pool.query(sql, [id_area, nombres, apellidos, usuario, contrasenia, avatar, rol, activo]);
    //     return rows[0];
    // }

    // static async update(id, input) {
    //     const targetId = typeof id === 'object' ? (id.id_usuario ?? id.id) : id;
    //     const data = typeof id === 'object' && !input ? id : input;
    //     const {
    //         nombres = data.nombre,
    //         apellidos = data.apellido,
    //         usuario = data.nombre_usuario,
    //         contrasenia = data.contrasenia,
    //         activo = data.activo
    //     } = data;

    //     const sql = `
    //         UPDATE usuarios
    //         SET nombres = COALESCE($1, nombres),
    //             apellidos = COALESCE($2, apellidos),
    //             usuario = COALESCE($3, usuario),
    //             contrasenia = COALESCE($4, contrasenia),
    //             activo = COALESCE($5, activo)
    //         WHERE id_usuario = $6
    //         RETURNING id_usuario, id_area, nombres, apellidos, usuario, avatar, rol, activo;
    //     `;
    //     const { rows } = await pool.query(sql, [nombres ?? null, apellidos ?? null, usuario ?? null, contrasenia ?? null, activo ?? null, targetId]);
    //     return rows[0];
    // }

    // static async delete(input) {
    //     const id = typeof input === 'object' ? (input.id_usuario ?? input.id) : input;
    //     const sql = `UPDATE usuarios SET activo = 0 WHERE id_usuario = $1 RETURNING id_usuario;`;
    //     const { rows } = await pool.query(sql, [id]);
    //     return rows[0];
    // }



}

export default User;