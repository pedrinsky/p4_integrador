import { Router } from "express";

import { getAllTransform as getAllIncidenciasTransform
    , getByIDTransform as getByIDIncidenciaTransform
    , updateTransform as updateIncidenciaTransform
    , createTransform as createIncidenciaTransform
    , deleteTransform as deleteIncidenciaTransform }
    from "../src/middleware/incidenciaTransformer.js";

import { IncidenciasController } from "../src/controller/incidenciasController.js";

export const createIncidenciasRouter = ({incidenciasService}) => {
    const router = Router();
    console.log("Router");
    const incidenciasController = new IncidenciasController({incidenciasService: incidenciasService});

    router.get("/", getAllIncidenciasTransform, incidenciasController.getAll);

    router.get("/:id_incidencia", getByIDIncidenciaTransform, incidenciasController.getByID);

    router.patch("/:id_incidencia", updateIncidenciaTransform, incidenciasController.update);

    router.post("/", createIncidenciaTransform, incidenciasController.create);

    router.delete("/:id_incidencia", deleteIncidenciaTransform, incidenciasController.delete);

    // Legacy frontend support
    router.put("/:id_incidencia/finalizar", incidenciasController.finalizar);
    router.put("/:id_incidencia/reabrir", incidenciasController.reabrir);
    
    return router;
}