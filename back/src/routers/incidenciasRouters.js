import { Router } from "express";

import { getAllTransform as getAllIncidenciasTransform
    , getByIDTransform as getByIDIncidenciaTransform
    , updateTransform as updateIncidenciaTransform
    , createTransform as createIncidenciaTransform
    , deleteTransform as deleteIncidenciaTransform }
    from "../tranformers/incidencias-transformer.js";

import { IncidenciasController } from "../controller/incidencias-controller.js";

export const createIncidenciasRouter = ({incidenciasService}) => {
    const router = Router();
    const incidenciasController = new IncidenciasController({incidenciasService: incidenciasService});

    router.get("/", getAllIncidenciasTransform, incidenciasController.getAll);

    router.get("/dashboard/metrics", incidenciasController.getDashboardMetrics);

    router.get("/reporte/pdf", incidenciasController.generarReportePDF);

    router.get("/:id_incidencia", getByIDIncidenciaTransform, incidenciasController.getByID);

    router.patch("/:id_incidencia", updateIncidenciaTransform, incidenciasController.update);

    router.post("/", createIncidenciaTransform, incidenciasController.create);

    router.delete("/:id_incidencia", deleteIncidenciaTransform, incidenciasController.delete);

    // Legacy frontend support
    router.put("/:id_incidencia/finalizar", incidenciasController.finalizar);
    router.put("/:id_incidencia/solicitar-reapertura", incidenciasController.solicitarReapertura);
    router.put("/:id_incidencia/reabrir", incidenciasController.reabrir);
    
    return router;
}