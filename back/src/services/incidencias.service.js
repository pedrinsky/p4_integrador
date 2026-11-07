import { IncidenciasRepository } from "../repository/incidencias.repository.js";
import { IncidenciasEstadosRepository } from "../repository/incidencias-estados.repository.js";
import { IncidenciasResponseDTO } from "../dto/incidencias.dto.js";

export class IncidenciasService{
    static async getAll(input){
        console.log("Service");
        const result = await IncidenciasRepository.getAll(input);
        return result.map(incidencia => new IncidenciasResponseDTO(incidencia));
    }

    static async getByID(input){
        console.log("Service");
        const result = await IncidenciasRepository.getByID(input);
        return new IncidenciasResponseDTO(result);
    }

    static async update(input){
        console.log("Service");
        console.log(input);
        const resultado = await IncidenciasRepository.update(input);
        // if(resultado !== undefined && input.id_estado !== undefined){
        //     const estado = await IncidenciasEstadosRepository.create(resultado);
        // }
        return await this.getByID(resultado);
    }

    static async create(input){
        console.log("Service");
        const resultado = await IncidenciasRepository.create(input);
        return await this.getByID(resultado);
    }

    static async delete(input){
        console.log("Service");
        const resultado = await IncidenciasRepository.delete(input);
        // if(resultado !== undefined){
        //     const estado = await IncidenciasEstadosRepository.create(resultado);
        // }
        return await this.getByID(resultado);
    }
}