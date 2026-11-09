import { CategoriaResponseDTO } from "../dto/categorias.dto.js";


export class CategoriasController{
    constructor({categoriasService}){
        this.categoriasService = categoriasService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.categoriasService.getAll(req.dto);
        console.log(result);

        const limit = Number(req.dto?.limit) || 5;
        const totalRegistros = result.length > 0 && result[0].total_registros 
            ? parseInt(result[0].total_registros, 10) 
            : result.length;
        const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
        const paginaActual = Number(req.dto?.page) ||
            (Math.floor(Number(req.dto?.offset || 0) / limit) + 1);

        res.json({
            categorias: result,
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
        const result = await this.categoriasService.getByID(req.dto);
        console.log(result);
        res.json(result);
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.categoriasService.update(req.dto);
        console.log(result);
        res.json(result);
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.categoriasService.create(req.dto);
        console.log(result);
        res.json(result);
    }

    delete = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.categoriasService.delete(req.dto);
        console.log(result);
        res.json(result);
    }

    reactivar = async (req, res) => {
        console.log("Controller");
        const result = await this.categoriasService.reactivar(req.dto);
        res.json(result);
    }

    deleteDefinitivo = async (req, res) => {
        console.log("Controller deleteDefinitivo");
        try {
            const result = await this.categoriasService.eliminarDefinitivo(req.dto);
            res.json(result);
        } catch (error) {
            console.error("Error al borrar definitivamente:", error);
            res.status(500).json({ error: "No se puede borrar porque pertenece a artículos existentes." });
        }
    }
}