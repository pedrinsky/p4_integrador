import { IncidenciasEstadosRepository } from "../repository/incidencias-estados-repository.js";

export class IncidenciasEstadosService{
    static async create(input){
        console.log("Service");
        return IncidenciasEstadosRepository.create(input);
    }
}