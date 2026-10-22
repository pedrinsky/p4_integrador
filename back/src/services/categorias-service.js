import { CategoriasRepository } from "../repository/categorias-repository.js";
import { CategoriaResponseDTO } from "../dto/categorias-dto.js";

export class CategoriasService{
    static async getAll(input){
        console.log("Service");
        const resultado  = await CategoriasRepository.getAll(input);
        const categorias = resultado.map(categoria =>  new CategoriaResponseDTO(categoria));
        return categorias;
    }

    static async getByID(input){
        console.log("Service");
        const resultado = await CategoriasRepository.getByID(input);
        return new CategoriaResponseDTO(resultado);
    }

    static async update(input){
        console.log("service");
        const resultado = await CategoriasRepository.update(input);
        return await this.getByID(resultado);
    }

    static async create(input){
        console.log("Service");
        const resultado = await CategoriasRepository.create(input);
        return await this.getByID(resultado);
    }

    static async delete(input){
        console.log("Service");
        const resultado = await CategoriasRepository.delete(input);
        return await this.getByID(resultado);
    }
}