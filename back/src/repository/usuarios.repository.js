import {pool} from '../config/db.js';
import * as BR from '../utils/base.repository.js';

const TABLE_NAME = 'usuarios';
const ID_COLUMN = 'id_usuario;';

export const findAll = async () => {
    return BR.findActives(TABLE_NAME);
}

export const getById = async (id) => {
    return BR.findActivesById(TABLE_NAME, ID_COLUMN, id);
}

export const getByUsername = async (username) => {
    return pool.query(`SELECT * FROM ${TABLE_NAME} WHERE nombre_usuario = $1 AND activo = 1`,
        [username]);
}

export const findSistemasEmpleados = async () => {
    const res = await pool.query(`SELECT id_usuario, nombres, apellidos FROM ${TABLE_NAME} WHERE rol = 2 AND activo = 1`);
    return res.rows || res;
}