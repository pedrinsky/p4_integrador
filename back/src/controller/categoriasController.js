import { pool } from '../config/db.js';



export class CategoriasController{
    constructor({categoriasService}){
        this.categoriasService = categoriasService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.getAll(req.criteria);
        console.log(result);
        res.json(result);
    }

    getByID = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.getByID(req.criteria);
        console.log(result);
        res.json(result);
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.update(req.criteria);
        console.log(result);
        res.json(result);
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.create(req.criteria);
        console.log(result);
        res.json(result);
    }

    delete = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.categoriasService.delete(req.criteria);
        console.log(result);
        res.json(result);
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