import { ArticulosRepository } from "../repository/articulos.repository.js";

export class ArticulosService{

    static async getAll(input){
        return await ArticulosRepository.getAll(input);
    }

    static async getByID(input){
        return await ArticulosRepository.getByID(input);
    }

    static async update(input){
        const resultado = await ArticulosRepository.update(input);
        return await this.getByID(resultado);
    }

    static async create(input){
        const resultado = await ArticulosRepository.create(input);
        return await this.getByID(resultado.id_articulo);
    }

    static async delete(input){
        const resultado = await ArticulosRepository.delete(input);
        return await this.getByID(resultado);
    }

    static async reactivar(input){
        const resultado = await ArticulosRepository.reactivar(input);
        return await this.getByID(resultado);
    }

    static async eliminarDefinitivo(input){
        return await ArticulosRepository.eliminarDefinitivo(input);
    }
}