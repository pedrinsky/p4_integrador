import { NotificacionesRepository } from "../repository/notificaciones-repository.js";

export class NotificacionesService {
    static async obtenerPorUsuario(id_usuario) {
        const [notificaciones, noLeidas] = await Promise.all([
            NotificacionesRepository.getByUsuario(id_usuario),
            NotificacionesRepository.contarNoLeidas(id_usuario)
        ]);
        return { notificaciones, noLeidas };
    }

    static async marcarTodasLeidas(id_usuario) {
        return await NotificacionesRepository.marcarTodasLeidas(id_usuario);
    }

    static async notificarAsignacion({ id_tecnico, id_incidencia, articulo }) {
        if (!id_tecnico) return;
        const descArticulo = articulo ? ` (${articulo})` : '';
        const mensaje = `Se te ha asignado la incidencia #${id_incidencia}${descArticulo}.`;
        return await NotificacionesRepository.create({
            id_usuario: id_tecnico,
            id_incidencia,
            mensaje
        });
    }

    static async notificarResolucion({ id_creador, id_incidencia, articulo, descripcion_resolucion }) {
        if (!id_creador) return;
        const descArticulo = articulo ? ` (${articulo})` : '';
        const resolucionLimpia = typeof descripcion_resolucion === 'string' ? descripcion_resolucion.trim() : '';
        const detalle = resolucionLimpia ? ` Detalle: "${resolucionLimpia}"` : '';
        const mensaje = `Tu incidencia #${id_incidencia}${descArticulo} ha sido resuelta.${detalle}`;
        return await NotificacionesRepository.create({
            id_usuario: id_creador,
            id_incidencia,
            mensaje
        });
    }

    static async notificarReapertura({ id_tecnico, id_incidencia, articulo }) {
        if (!id_tecnico) return;
        const descArticulo = articulo ? ` (${articulo})` : '';
        const mensaje = `El empleado municipal solicitó reabrir la incidencia #${id_incidencia}${descArticulo}.`;
        return await NotificacionesRepository.create({
            id_usuario: id_tecnico,
            id_incidencia,
            mensaje
        });
    }

    static async notificarReaperturaCreador({ id_creador, id_incidencia, articulo }) {
        if (!id_creador) return;
        const descArticulo = articulo ? ` (${articulo})` : '';
        const mensaje = `Tu incidencia #${id_incidencia}${descArticulo} ha sido reabierta.`;
        return await NotificacionesRepository.create({
            id_usuario: id_creador,
            id_incidencia,
            mensaje
        });
    }
}

