export class ArticulosController{
    constructor({articulosService}){
        this.articulosService = articulosService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const {rows} = await this.articulosService.getAll({...req.criteria});
        console.log(rows);
        res.json(rows);
    }
}