import { CategoriasRepository } from "../repository/categorias-repository.js";

export class CategoriasService{
    static async getAll(input){
        console.log("Service");
        return await CategoriasRepository.getAll(input);
    }

    static async getByID(input){
        console.log("Service");
        return await CategoriasRepository.getByID(input);
    }

    static async update(input){
        console.log("Service");
        const resultado = await CategoriasRepository.update(input);
        console.log(resultado);
        return await this.getByID(resultado);
    }

    static async create(input){
        console.log("Service");
        const resultado = await CategoriasRepository.create(input);
        console.log(resultado)
        return await this.getByID(resultado);
    }

    static async delete(input){
        console.log("Service");
        const resultado = await CategoriasRepository.delete(input);
        console.log(resultado);
        return await this.getByID(resultado);
    }
}