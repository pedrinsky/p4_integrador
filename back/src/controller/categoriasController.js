import { CategoriaResponseDTO } from "../dto/categorias-dto.js";


export class CategoriasController{
    constructor({categoriasService}){
        this.categoriasService = categoriasService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.getAll(req.criteria);
        console.log(result);

        const limit = Number(req.criteria?.limit) || 5;
        const totalRegistros = result.length > 0 && result[0].total_registros 
            ? parseInt(result[0].total_registros, 10) 
            : result.length;
        const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
        const paginaActual = Number(req.criteria?.page) || (Math.floor(Number(req.criteria?.offset || 0) / limit) + 1);

        const dtoCategorias = result.map(categoria => new CategoriaResponseDTO(categoria));

        res.json({
            categorias: dtoCategorias,
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
        const result = await this.categoriasService.getByID(req.criteria);
        console.log(result);
        res.json(new CategoriaResponseDTO(result));
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.update(req.criteria);
        console.log(result);
        res.json(new CategoriaResponseDTO(result));
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.create(req.criteria);
        console.log(result);
        res.json(new CategoriaResponseDTO(result));
    }

    delete = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.delete(req.criteria);
        console.log(result);
        res.json(new CategoriaResponseDTO(result));
    }

    reactivar = async (req, res) => {
        console.log("Controller reactivar");
        const result = await this.categoriasService.reactivar(req.criteria);
        res.json(result);
    }

    deleteDefinitivo = async (req, res) => {
        console.log("Controller deleteDefinitivo");
        try {
            const result = await this.categoriasService.eliminarDefinitivo(req.criteria);
            res.json(result);
        } catch (error) {
            console.error("Error al borrar definitivamente:", error);
            res.status(500).json({ error: "No se puede borrar porque pertenece a artículos existentes." });
        }
    }
}