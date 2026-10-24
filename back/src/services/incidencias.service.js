import { IncidenciasRepository } from "../repository/incidencias.repository.js";
import { IncidenciasEstadosRepository } from "../repository/incidencias-estados.repository.js";

export class IncidenciasService{
    static async getAll(input){
        console.log("Service");
        return await IncidenciasRepository.getAll(input);
    }

    static async getByID(input){
        console.log("Service");
        return await IncidenciasRepository.getByID(input);
    }

    static async update(input){
        console.log("Service");
        console.log(input.id_estado);
        const resultado = await IncidenciasRepository.update(input);
        if(resultado !== undefined && input.id_estado !== undefined){
            const estado = await IncidenciasEstadosRepository.create(resultado);
        }
        return await this.getByID(resultado);
    }

    static async create(input){
        console.log("Service");
        const resultado = await IncidenciasRepository.create(input);
        return await this.getByID(resultado.id_incidencia);
    }

    static async delete(input){
        console.log("Service");
        const resultado = await IncidenciasRepository.delete(input);
        if(resultado !== undefined){
            const estado = await IncidenciasEstadosRepository.create(resultado);
        }
        return await this.getByID(resultado);
    }
}