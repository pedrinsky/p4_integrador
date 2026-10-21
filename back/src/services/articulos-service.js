import { ArticulosRepository } from "../repository/articulos-repository.js";

export class ArticulosService{

    static async getAll(input){
        console.log("Service");
        return await ArticulosRepository.getAll(input);
    }

    static async getByID(input){
        console.log("Service");
        return await ArticulosRepository.getByID(input);
    }

    static async update(input){
        console.log("Service");
        const resultado = await ArticulosRepository.update(input);
        return await this.getByID(resultado);
    }

    static async create(input){
        console.log("Service");
        const resultado = await ArticulosRepository.create(input);
        return await this.getByID(resultado.id_articulo);
    }

    static async delete(input){
        console.log("Service");
        const resultado = await ArticulosRepository.delete(input);
        return await this.getByID(resultado);
    }
}