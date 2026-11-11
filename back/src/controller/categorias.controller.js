import { CategoriaResponseDTO } from "../dto/categorias.dto.js";


export class CategoriasController{
    constructor({categoriasService}){
        this.categoriasService = categoriasService;
    }

    getAll = async (req, res) => {
        try{
            const result = await this.categoriasService.getAll(req.criteria);

            const limit = Number(req.criteria?.limit) || 5;
            const totalRegistros = result.length > 0 && result[0].total_registros 
                ? parseInt(result[0].total_registros, 10) 
                : result.length;
            const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
            const paginaActual = Number(req.criteria?.page) || (Math.floor(Number(req.criteria?.offset || 0) / limit) + 1);

            const dtoCategorias = result.map(categoria => new CategoriaResponseDTO(categoria));

            return res.json({
                categorias: dtoCategorias,
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
            const result = await this.categoriasService.getByID(req.criteria);
            return res.json(new CategoriaResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    update = async (req, res) => {
        try{
            const result = await this.categoriasService.update(req.criteria);
            return res.json(new CategoriaResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    create = async (req, res) => {
        try{
            const result = await this.categoriasService.create(req.criteria);
            return res.json(new CategoriaResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    delete = async (req, res) => {
        try{
            const result = await this.categoriasService.delete(req.criteria);
            return res.json(new CategoriaResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    reactivar = async (req, res) => {
        try{
            const result = await this.categoriasService.reactivar(req.criteria);
            return res.json(result);
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
    }

    deleteDefinitivo = async (req, res) => {
        try {
            const result = await this.categoriasService.eliminarDefinitivo(req.criteria);
            res.json(result);
        } catch (error) {
            console.error("Error al borrar definitivamente:", error);
            res.status(500).json({ error: "No se puede borrar porque pertenece a artículos existentes." });
        }
    }
}