import {Router} from 'express';
import { getAllTransform as getAllTransformArticulos
    ,getByIDTransform as getByIDArticulosTransform} 
    from '../middleware/tranformers/articulos-transformer.js';

// import { ArticulosService } from '../services/articulos-service.js';
import { ArticulosController } from '../controller/articulos-controller.js';

export const createArticulosRouter = ({articulosService}) => {
    const router = Router();
    console.log("Router");
    const articulosController = new ArticulosController({articulosService : articulosService});

    router.get("/", getAllTransformArticulos, articulosController.getAll);

    router.get("/:id_articulo", getByIDArticulosTransform, articulosController.getByID);

    return router;
}