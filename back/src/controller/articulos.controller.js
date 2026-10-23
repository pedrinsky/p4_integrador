import { ArticulosResponseDTO } from "../dto/articulos.dto.js";

export class ArticulosController{
    constructor({articulosService}){
        this.articulosService = articulosService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.getAll(req.criteria);
        console.log(result);

        const limit = Number(req.criteria?.limit) || 5;
        const totalRegistros = result.length > 0 && result[0].total_registros 
            ? parseInt(result[0].total_registros, 10) 
            : result.length;
        const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
        const paginaActual = Number(req.criteria?.page) || (Math.floor(Number(req.criteria?.offset || 0) / limit) + 1);

        const articulosDTO = result.map(articulo => new ArticulosResponseDTO(articulo));

        res.json({
            articulos: articulosDTO,
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
        const result = await this.articulosService.getByID(req.criteria);
        console.log(result);
        res.json(new ArticulosResponseDTO(result));
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.update(req.criteria);
        console.log(result);
        res.json(new ArticulosResponseDTO(result));
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.create(req.criteria);
        console.log(result);
        res.json(new ArticulosResponseDTO(result));
    }

    delete = async (req, res) => {
        const result = await this.articulosService.delete(req.criteria);
        console.log(result);
        res.json(new ArticulosResponseDTO(result));
    }

    reactivar = async (req, res) => {
        const result = await this.articulosService.reactivar(req.criteria);
        res.json(result);
    }

    deleteDefinitivo = async (req, res) => {
        try {
            const result = await this.articulosService.eliminarDefinitivo(req.criteria);
            res.json(result);
        } catch (error) {
            console.error("Error al borrar definitivamente artículo:", error);
            res.status(500).json({ error: "No se puede borrar porque está vinculado a una o más incidencias históricas." });
        }
    }
}