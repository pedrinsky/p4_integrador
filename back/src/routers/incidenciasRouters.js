import { Router } from "express";
import authenticate from "../middleware/authenticate.js";

import { getAllTransform as getAllIncidenciasTransform
    , getByIDTransform as getByIDIncidenciaTransform
    , updateTransform as updateIncidenciaTransform
    , createTransform as createIncidenciaTransform
    , deleteTransform as deleteIncidenciaTransform }
    from "../tranformers/incidencias-transformer.js";

import { IncidenciasController } from "../controller/incidencias-controller.js";

export const createIncidenciasRouter = ({incidenciasService}) => {
    const router = Router();
    console.log("Router");
    const incidenciasController = new IncidenciasController({incidenciasService: incidenciasService});

    router.get("/", authenticate, getAllIncidenciasTransform, incidenciasController.getAll);

    router.get("/dashboard/metrics", authenticate, incidenciasController.getDashboardMetrics);

    router.get("/reporte/pdf", authenticate, incidenciasController.generarReportePDF);

    router.get("/:id_incidencia", authenticate, getByIDIncidenciaTransform, incidenciasController.getByID);

    router.patch("/:id_incidencia", authenticate, updateIncidenciaTransform, incidenciasController.update);

    router.post("/", authenticate, createIncidenciaTransform, incidenciasController.create);

    router.delete("/:id_incidencia", authenticate, deleteIncidenciaTransform, incidenciasController.delete);

    // Legacy frontend support
    router.put("/:id_incidencia/finalizar", authenticate, incidenciasController.finalizar);
    router.put("/:id_incidencia/solicitar-reapertura", authenticate, incidenciasController.solicitarReapertura);
    router.put("/:id_incidencia/reabrir", authenticate, incidenciasController.reabrir);
    
    return router;
}