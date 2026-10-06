import { Router } from "express";

import { getAllTransform as getAllIncidenciasTransform
    , getByIDTransform as getByIDIncidenciaTransform
    , updateTransform as updateIncidenciaTransform
    , createTransform as createIncidenciaTransform
    , deleteTransform as deleteIncidenciaTransform }
    from "../middleware/tranformers/incidencias-transformer.js";

import { IncidenciasController } from "../controller/incidencias-controller.js";

export const createIncidenciasRouter = ({incidenciasService}) => {
    const router = Router();
    console.log("Router");
    const incidenciasController = new IncidenciasController({incidenciasService: incidenciasService});

    router.get("/", getAllIncidenciasTransform, incidenciasController.getAll);

    router.get("/:id_incidencia", getByIDIncidenciaTransform, incidenciasController.getByID);

    router.patch("/:id_incidencia", updateIncidenciaTransform, incidenciasController.update);

    router.post("/", createIncidenciaTransform, incidenciasController.create);

    router.delete("/:id_incidencia", deleteIncidenciaTransform, incidenciasController.delete);

    return router;
}