import { IncidenciasResponseDTO } from "../dto/incidencias-dto.js";

export class IncidenciasController{
    constructor({incidenciasService}){
        this.incidenciasService = incidenciasService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.getAll(req.criteria);
        console.log(result);

        const limit = Number(req.criteria?.limit) || 5;
        const totalRegistros = result.length > 0 && result[0].total_registros 
            ? parseInt(result[0].total_registros, 10) 
            : result.length;
        const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
        const paginaActual = Number(req.criteria?.page) || (Math.floor(Number(req.criteria?.offset || 0) / limit) + 1);

        const incidenciasDTO = result.map(incidencia => new IncidenciasResponseDTO(incidencia));

        res.json({
            incidencias: incidenciasDTO,
            paginacion: {
                totalPaginas,
                paginaActual,
                totalRegistros,
                limitePorPagina: limit
            }
        });
    }

    getByID = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.getByID(req.criteria);
        console.log(result);
        res.json(new IncidenciasResponseDTO(result));
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.update(req.criteria);
        console.log(result);
        res.json(new IncidenciasResponseDTO(result));
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.create(req.criteria);
        console.log(result);
        res.json(new IncidenciasResponseDTO(result));
    }

    delete = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.delete(req.criteria);
        console.log(result);
        res.json(new IncidenciasResponseDTO(result));
    }
}