import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { NotificacionesController } from "../controller/notificaciones-controller.js";

export const createNotificacionesRouter = () => {
    const router = Router();

    // Obtener notificaciones del usuario autenticado
    router.get("/", authenticate, NotificacionesController.getPorUsuario);

    // Marcar todas las notificaciones como leídas
    router.patch("/leer-todas", authenticate, NotificacionesController.marcarTodasLeidas);

    return router;
};

