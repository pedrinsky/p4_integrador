import {Router} from 'express';
import { getAllUsuariosTransform
    , getByIDUsuariosTransform
    , updateUsuariosTransform
    , createUsuariosTransform
    , deleteUsuariosTransform }
    from "../src/tranformers/usuarios-transformer.js";
import { UsuariosController } from "../src/controller/usuarios-controller.js";

export const createUser = ({usuariosService}) => {
    const router = Router();
    console.log("Router");
    const usuariosController = new UsuariosController({usuariosService: usuariosService});

    router.get("/", getAllUsuariosTransform, usuariosController.getAll);

    router.get("/sistemas", usuariosController.getSistemas);

    router.get("/:id", getByIDUsuariosTransform, usuariosController.getByID);

    router.patch("/:id", updateUsuariosTransform, usuariosController.update);

    router.post("/", createUsuariosTransform, usuariosController.create);

    router.delete("/:id", deleteUsuariosTransform, usuariosController.delete);

    return router;
}