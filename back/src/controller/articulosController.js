import { pool } from '../config/db.js';



export class ArticulosController{
    constructor({articulosService}){
        this.articulosService = articulosService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.getAll(req.criteria);
        console.log(result);
        res.json(result);
    }

    getByID = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.getByID(req.criteria);
        console.log(result);
        res.json(result);
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.update(req.criteria);
        console.log(result);
        res.json(result);
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.create(req.criteria);
        console.log(result);
        res.json(result);
    }

    delete = async (req, res) => {
        const result = await this.articulosService.delete(req.criteria);
        res.json(result);
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