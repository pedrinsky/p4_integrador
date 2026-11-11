import { ArticulosResponseDTO } from "../dto/articulos-dto.js";

export class ArticulosController{
    constructor({articulosService}){
        this.articulosService = articulosService;
    }

    getAll = async (req, res) => {
        try{
            const result = await this.articulosService.getAll(req.criteria);

            const limit = Number(req.criteria?.limit) || 5;
            const totalRegistros = result.length > 0 && result[0].total_registros 
                ? parseInt(result[0].total_registros, 10) 
                : result.length;
            const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
            const paginaActual = Number(req.criteria?.page) || (Math.floor(Number(req.criteria?.offset || 0) / limit) + 1);

            const articulosDTO = result.map(articulo => new ArticulosResponseDTO(articulo));

            return res.json({
                articulos: articulosDTO,
                paginacion: {
                    totalPaginas,
                    paginaActual,
                    totalRegistros,
                    limitePorPagina: limit
                }
            });
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    getByID = async (req, res) => {
        try{
            const result = await this.articulosService.getByID(req.criteria);
            return res.json(new ArticulosResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
    }

    update = async (req, res) => {
        try{
            const result = await this.articulosService.update(req.criteria);
            return res.json(new ArticulosResponseDTO(result));
        }catch{
            res.status(500).json({ message: "Error interno" });
        }
    }

    create = async (req, res) => {
        try{
            const result = await this.articulosService.create(req.criteria);
            return res.json(new ArticulosResponseDTO(result));
        }catch{
            res.status(500).json({ message: "Error interno" });
        }
    }

    delete = async (req, res) => {
        try{
            const result = await this.articulosService.delete(req.criteria);
            res.json(new ArticulosResponseDTO(result));
        }catch{
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    reactivar = async (req, res) => {
        try{
            const result = await this.articulosService.reactivar(req.criteria);
            res.json(result);
        }catch{
            res.status(500).json({ message: "Error interno" });
        }
        
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