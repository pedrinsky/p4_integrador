import { CategoriasRepository } from "../repository/categorias-repository.js";

export class CategoriasService{
    static async getAll(input){
        return await CategoriasRepository.getAll(input);
    }

    static async getByID(input){
        return await CategoriasRepository.getByID(input);
    }

    static async update(input){
        const resultado = await CategoriasRepository.update(input);
        return await this.getByID(resultado);
    }

    static async create(input){
        const resultado = await CategoriasRepository.create(input);
        return await this.getByID(resultado);
    }

    static async delete(input){
        const resultado = await CategoriasRepository.delete(input);
        return await this.getByID(resultado);
    }
}