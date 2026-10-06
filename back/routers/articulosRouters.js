import {Router} from 'express';
import { getAllTransform as getAllTransformArticulos
    ,getByIDTransform as getByIDArticuloTransform
    ,updateTransform as updateArticuloTransform
    ,createTransform as createArticuloTransform
    ,deleteTransform as deleteArticuloTransform} 
    from '../src/middleware/articulosTransformer.js';

// import { ArticulosService } from '../services/articulos-service.js';
import { ArticulosController } from "../src/controller/articulosController.js";

export const createArticulosRouter = ({articulosService}) => {
    const router = Router();
    console.log("Router");
    const articulosController = new ArticulosController({articulosService : articulosService});

    router.get("/", getAllTransformArticulos, articulosController.getAll);

    router.get("/:id_articulo", getByIDArticuloTransform, articulosController.getByID);

    router.patch("/:id_articulo", updateArticuloTransform, articulosController.update);

    router.post("/", createArticuloTransform, articulosController.create);

    router.delete("/:id_articulo", deleteArticuloTransform, articulosController.delete);

    return router;
}