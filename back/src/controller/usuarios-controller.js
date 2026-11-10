import { UsuariosResponseDTO } from "../dto/usuarios-dto.js";

export class UsuariosController{
    constructor({usuariosService}){
        this.usuariosService = usuariosService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.usuariosService.getAll(req.criteria);
        console.log(result);
        res.json(result.map(usuario => new UsuariosResponseDTO(usuario)));
    }

    getSistemas = async (req, res) => {
        try {
            console.log("Controller getSistemas");
            const result = await this.usuariosService.getSistemas();
            res.json(result.map(u => new UsuariosResponseDTO(u)));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getByID = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.usuariosService.getByID(req.criteria);
        console.log(result);
        res.json(new UsuariosResponseDTO(result));
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.usuariosService.update(req.criteria);
        console.log(result);
        res.json(new UsuariosResponseDTO(result));
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.usuariosService.create(req.criteria);
        console.log(result);
        res.json(new UsuariosResponseDTO(result));
    }

    delete = async (req, res) => {
        console.log("Controller");
        console.log(req.criteria);
        const result = await this.usuariosService.delete(req.criteria);
        console.log(result);
        res.json(new UsuariosResponseDTO(result));
    }
}