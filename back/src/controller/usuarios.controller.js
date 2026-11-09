import { UsuariosResponseDTO } from "../dto/usuarios.dto.js";

export class UsuariosController{
    constructor({usuariosService}){
        this.usuariosService = usuariosService;
    }

    getAll = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.usuariosService.getAll(req.dto);
        console.log(result);
        // res.json(result.map(usuario => new UsuariosResponseDTO(usuario)));
        res.json(result);
    }

    //Arreglar
    getSistemas = async (req, res) => {
        console.log("Controller");
        const result = await this.usuariosService.getAll();
        const empleadosSistemas = result.filter(u => Number(u.rol) === 2 && u.activo === 1);
        // res.json(empleadosSistemas.map(u => new UsuariosResponseDTO(u)));
        res.json(empleadosSistemas.map(empleadosSistemas));
    }

    getByID = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.usuariosService.getByID(req.dto);
        console.log(result);
        res.json(result);
    }

    update = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.usuariosService.update(req.dto);
        console.log(result);
        // res.json(new UsuariosResponseDTO(result));
        res.json(result);
    }

    create = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.usuariosService.create(req.dto);
        console.log(result);
        // res.json(new UsuariosResponseDTO(result));
        res.json(result);
    }

    delete = async (req, res) => {
        console.log("Controller");
        console.log(req.dto);
        const result = await this.usuariosService.delete(req.dto);
        console.log(result);
        res.json(new UsuariosResponseDTO(result));
    }
}