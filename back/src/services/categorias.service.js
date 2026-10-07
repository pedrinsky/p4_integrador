import { 
    cargarCategorias, 
    readCategoria, 
    crearCategoria, 
    editarCategoria, 
    borrarCategoria,
    reactivarCategoria,
    borradoDefinitivoCategoria
} from '../repository/categoria.repository.js';

export class CategoriasService {
    static async getAll(input) {
        console.log("Service Categorias getAll");
        const limitInt = parseInt(input.limit) || 10;
        const pageInt = parseInt(input.page) || 1;
        const offset = (pageInt - 1) * limitInt;
        input.limit = limitInt;
        input.offset = offset;
        return await cargarCategorias(input);
    }

    static async getByID(input) {
        console.log("Service Categorias getByID");
        return await readCategoria(input.id_categoria);
    }

    static async update(input) {
        console.log("Service Categorias update");
        return await editarCategoria(input.id_categoria, { descripcion: input.descripcion });
    }

    static async create(input) {
        console.log("Service Categorias create");
        return await crearCategoria(input);
    }

    static async delete(input) {
        console.log("Service Categorias delete (soft)");
        return await borrarCategoria(input.id_categoria);
    }

    static async reactivar(input) {
        console.log("Service Categorias reactivar");
        return await reactivarCategoria(input.id_categoria);
    }

    static async eliminarDefinitivo(input) {
        console.log("Service Categorias eliminarDefinitivo (hard)");
        return await borradoDefinitivoCategoria(input.id_categoria);
    }
}