import * as UR from '../repository/usuarios.repository.js'

export const getAll = async () => {
    const usuarios = await UR.findAll();
    return removeContrasenia(usuarios);
}

export const getById = async (id) => {
    const usuarios = await UR.getById(id);
    return removeContrasenia(usuarios);
}

export const getSistemasEmpleados = async () => {
    const usuarios = await UR.findSistemasEmpleados();
    return usuarios; // no password included in SQL
}
