import {pool} from '../config/db.js'

export const findAll = async (tableName) => {
    return await pool.query(`SELECT * FROM ${tableName}`);
}

export const findById = async (tableName, idColumn, id) => {
    const text = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
    return await pool.query(text, [id]);
}

export const findActives = async (tableName, activeCondition = 'activo = 1') => {
    return await pool.query(`SELECT * FROM ${tableName} WHERE ${activeCondition}`);
}

export const findActivesById = async (tableName, idColumn, id, activeCondition = 'activo = 1') => {
    const text = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1 AND ${activeCondition}`;
    return await pool.query(text, [id]);
}