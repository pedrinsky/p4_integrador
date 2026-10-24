import { UsuariosResponseDTO } from "../dto/usuarios.dto.js";

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
        console.log("Controller");
        const result = await this.usuariosService.getAll();
        const empleadosSistemas = result.filter(u => Number(u.rol) === 2 && u.activo === 1);
        res.json(empleadosSistemas.map(u => new UsuariosResponseDTO(u)));
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