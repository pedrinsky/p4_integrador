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
}