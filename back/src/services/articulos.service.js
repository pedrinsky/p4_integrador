import { ArticulosRepository } from "../repository/articulos.repository.js";
import { ArticulosResponseDTO } from "../dto/articulos.dto.js";

export class ArticulosService{

    static async getAll(input){
        console.log("Service");
        const result = await ArticulosRepository.getAll(input);
        return result.map(articulo => new ArticulosResponseDTO(articulo));
    }

    static async getByID(input){
        console.log("Service");
        const result = await ArticulosRepository.getByID(input);
        return new ArticulosResponseDTO(result);
    }

    static async update(input){
        console.log("Service");
        const resultado = await ArticulosRepository.update(input);
        return await this.getByID(resultado);
        // return new ArticulosResponseDTO(resultado);
    }

    static async create(input){
        console.log("Service");
        const resultado = await ArticulosRepository.create(input);
        return await this.getByID(resultado);
    }

    static async delete(input){
        console.log("Service");
        const resultado = await ArticulosRepository.delete(input);
        return await this.getByID(resultado);
    }

    static async reactivar(input){
        console.log("Service");
        const resultado = await ArticulosRepository.update(input);
        return await this.getByID(resultado);
    }
}