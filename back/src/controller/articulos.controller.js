import { ArticulosResponseDTO } from "../dto/articulos.dto.js";

export class ArticulosController{
    constructor({articulosService}){
        this.articulosService = articulosService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.articulosService.getAll(req.dto);
        console.log(result);

        const limit = Number(req.dto?.limit) || 5;
        const totalRegistros = result.length > 0 && result[0].total_registros 
            ? parseInt(result[0].total_registros, 10) 
            : result.length;
        const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
        const paginaActual = Number(req.dto?.page) || 
            (Math.floor(Number(req.dto?.offset || 0) / limit) + 1);

        res.json({
            articulos: result,
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
        console.log(req.dto);
        const result = await this.articulosService.getByID(req.dto);
        console.log(result);
        res.json(result);
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.articulosService.update(req.dto);
        console.log(result);
        res.json(result);
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.articulosService.create(req.dto);
        console.log(result);
        res.json(result);
    }

    delete = async (req, res) => {
        const result = await this.articulosService.delete(req.dto);
        console.log(result);
        res.json(result);
    }

    reactivar = async (req, res) => {
        const result = await this.articulosService.reactivar(req.dto);
        console.log(result);
        res.json(result);
    }

    deleteDefinitivo = async (req, res) => {
        try {
            const result = await this.articulosService.eliminarDefinitivo(req.dto);
            res.json(result);
        } catch (error) {
            console.error("Error al borrar definitivamente artículo:", error);
            res.status(500).json({ error: "No se puede borrar porque está vinculado a una o más incidencias históricas." });
        }
    }
}