export class IncidenciasController{
    constructor({incidenciasService}){
        this.incidenciasService = incidenciasService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.getAll(req.criteria);
        console.log(result);
        res.json(result);
    }

    getByID = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.getByID(req.criteria);
        console.log(result);
        res.json(result);
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.update(req.criteria);
        console.log(result);
        res.json(result);
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.create(req.criteria);
        console.log(result);
        res.json(result);
    }

    delete = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.incidenciasService.delete(req.criteria);
        console.log(result);
        res.json(result);
    }
}