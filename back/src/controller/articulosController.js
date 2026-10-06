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
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.articulosService.delete(req.criteria);
        console.log(result);
        res.json(result);
    }
}