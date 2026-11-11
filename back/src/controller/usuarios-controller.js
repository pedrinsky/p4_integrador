import { UsuariosResponseDTO } from "../dto/usuarios-dto.js";

export class UsuariosController{
    constructor({usuariosService}){
        this.usuariosService = usuariosService;
    }

    getAll = async (req, res) => {
        try{
            const result = await this.usuariosService.getAll(req.criteria);
            return res.json(result.map(usuario => new UsuariosResponseDTO(usuario)));
        }catch(err){
            return res.status(500).json({ message: "Error interno" });
        }
        
    }

    getSistemas = async (req, res) => {
        try {
            const result = await this.usuariosService.getSistemas();
            return res.json(result.map(u => new UsuariosResponseDTO(u)));
        } catch (error) {
            res.status(500).json({ message: "Error interno" });
        }
    }

    getByID = async (req, res) => {
        try{
            const result = await this.usuariosService.getByID(req.criteria);
            return res.json(new UsuariosResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    update = async (req, res) => {
        try{
            const result = await this.usuariosService.update(req.criteria);
            return  res.json(new UsuariosResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    create = async (req, res) => {
        try{
            const result = await this.usuariosService.create(req.criteria);
            return res.json(new UsuariosResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
        
    }

    delete = async (req, res) => {
        try{
            const result = await this.usuariosService.delete(req.criteria);
            res.json(new UsuariosResponseDTO(result));
        }catch(err){
            res.status(500).json({ message: "Error interno" });
        }
    }
}