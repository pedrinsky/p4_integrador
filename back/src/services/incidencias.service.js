import * as IR from '../repository/incidencias.repository.js';
import { IncidenciasRepository } from '../repository/incidencias.repository.js';

export class IncidenciasService {

    static async getAll(input) {
        console.log("Service getAll", input);
        return await IncidenciasRepository.getAll(input);
    }

    static async getByID(input) {
        return await IncidenciasRepository.getByID(input);
    }

    static async create(input) {
        console.log("Service create", input);
        return await IncidenciasRepository.create(input);
    }

    static async update(input) {
        console.log("Service update", input);
        // This is a mapping trick to allow finalizing or reopening via update
        if (input.id_estado === 3) {
            return await IncidenciasRepository.finalizarIncidencia(input.id_incidencia, input.descripcion_resolucion);
        } else if (input.id_estado === 1) {
            return await IncidenciasRepository.reabrirIncidencia(input.id_incidencia);
        }
        return await IncidenciasRepository.update(input);
    }

    static async delete(input) {
        return await IncidenciasRepository.delete(input);
    }
}
