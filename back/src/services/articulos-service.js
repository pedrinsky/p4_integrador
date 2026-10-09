import { ArticulosRepository } from "../repository/articulos-repository.js";
import { ArticulosResponseDTO } from "../dto/articulos-dto.js";

export class ArticulosService{

    static async getAll(input){
        console.log("Service");
        const resultado = await ArticulosRepository.getAll(input);
        const articulos = resultado.map(articulo => new ArticulosResponseDTO(articulo));
        return articulos;
    }

    static async getByID(input){
        console.log("Service");
        const resultado = await ArticulosRepository.getByID(input);
        return new ArticulosResponseDTO(resultado);
    }

    static async update(input){
        console.log("service");
        const resultado = await ArticulosRepository.update(input);
        return await this.getByID(resultado);
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
}