import { NotificacionesService } from "../services/notificaciones-service.js";

export class NotificacionesController {
    static async getPorUsuario(req, res) {
        try {
            const usuarioAutenticado = req.user || req.usuario;
            const idUsuario = usuarioAutenticado?.id_usuario ?? usuarioAutenticado?.id;

            if (!idUsuario) {
                return res.status(401).json({ error: "Usuario no autenticado." });
            }

            const resultado = await NotificacionesService.obtenerPorUsuario(idUsuario);
            return res.json(resultado);
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async marcarTodasLeidas(req, res) {
        try {
            const usuarioAutenticado = req.user || req.usuario;
            const idUsuario = usuarioAutenticado?.id_usuario ?? usuarioAutenticado?.id;

            if (!idUsuario) {
                return res.status(401).json({ error: "Usuario no autenticado." });
            }

            await NotificacionesService.marcarTodasLeidas(idUsuario);
            return res.json({ message: "Notificaciones marcadas como leídas." });
        } catch (error) {
            console.error("Error al marcar notificaciones como leídas:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

