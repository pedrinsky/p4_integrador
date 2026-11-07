import { CategoriasRepository } from "../repository/categorias.repository.js";
import { CategoriaResponseDTO } from "../dto/categorias.dto.js";

export class CategoriasService{
    static async getAll(input){
        console.log("Service");
        const result = await CategoriasRepository.getAll(input);
        return result.map(categoria => new CategoriaResponseDTO(categoria));
    }

    static async getByID(input){
        console.log("Service");
        const result = await CategoriasRepository.getByID(input);
        return new CategoriaResponseDTO(result);
    }

    static async update(input){
        console.log("Service");
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

    static async reactivar(input){
        console.log("Service");
        const resultado = await CategoriasRepository.update(input);
        return await this.getByID(resultado);
    }
}