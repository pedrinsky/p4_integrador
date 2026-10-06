import {Router} from 'express';
import { getAllTransform as getAllCategoriasTransform
    , getByIDTransform as getByIDCategoriaTransform
    , updateTransform as updateCategoriaTransform
    , createTransform as createCategoriaTransform
    , deleteTransform as deleteCategoriaTransform}
    from '../src/middleware/categoriasTransformer.js';

import { CategoriasController } from '../src/controller/categoriasController.js';

export const createCategoriasRouter = ({categoriasService}) => {
    const router = Router();
    console.log("Router");
    const categoriasController = new CategoriasController({categoriasService : categoriasService});

    router.get("/", getAllCategoriasTransform, categoriasController.getAll);

    router.get("/:id_categoria", getByIDCategoriaTransform, categoriasController.getByID);

    router.patch("/:id_categoria", updateCategoriaTransform, categoriasController.update);

    router.post("/", createCategoriaTransform, categoriasController.create);

    router.delete("/:id_categoria", deleteCategoriaTransform, categoriasController.delete);

    return router;
}