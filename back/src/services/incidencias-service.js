import { IncidenciasRepository } from "../repository/incidencias-repository.js";
import { IncidenciasEstadosRepository } from "../repository/incidencias-estados-repository.js";
import { User } from "../repository/users-repository.js";
import { MailService } from "./mail-service.js";
import { NotificacionesService } from "./notificaciones-service.js";

export class IncidenciasService{
    static async getAll(input){
        console.log("Service");
        return await IncidenciasRepository.getAll(input);
    }

    static async getByID(input){
        console.log("Service");
        return await IncidenciasRepository.getByID(input);
    }

    static async update(input){
        console.log("Service update");
        
        // Validación de regla de negocio: no modificar incidencias canceladas
        const idIncidencia = input.id_incidencia ?? input.id;
        if (idIncidencia) {
            const actual = await this.getByID(idIncidencia);
            if (actual && (Number(actual.id_estado) === 4 || actual.estado === 'Cancelada')) {
                const error = new Error("No se puede asignar ni modificar una incidencia que se encuentra cancelada.");
                error.statusCode = 400;
                throw error;
            }
        }

        const resultado = await IncidenciasRepository.update(input);
        if(resultado !== undefined && input.id_estado !== undefined){
            const estado = await IncidenciasEstadosRepository.create(resultado);
        }
        const incidenciaActualizada = await this.getByID(resultado);

        // --- Notificaciones en el sistema (campana) ---
        try {
            // 1. Notificar al Técnico de Sistemas si fue asignado en esta actualización
            if (input.asignado_a && incidenciaActualizada) {
                await NotificacionesService.notificarAsignacion({
                    id_tecnico: input.asignado_a,
                    id_incidencia: incidenciaActualizada.id_incidencia,
                    articulo: incidenciaActualizada.articulo
                });
            }

            // 2. Notificar al Empleado Municipal si su incidencia fue resuelta o reabierta
            const nuevoEstado = Number(input.id_estado);
            const idCreador = incidenciaActualizada.id_creador ?? incidenciaActualizada.creado_por;
            if (nuevoEstado === 3 && incidenciaActualizada && idCreador) {
                const descResolucion = input.descripcion_resolucion ?? incidenciaActualizada.descripcion_resolucion;
                await NotificacionesService.notificarResolucion({
                    id_creador: idCreador,
                    id_incidencia: incidenciaActualizada.id_incidencia,
                    articulo: incidenciaActualizada.articulo,
                    descripcion_resolucion: descResolucion
                });
            } else if (nuevoEstado === 1 && incidenciaActualizada && idCreador) {
                await NotificacionesService.notificarReaperturaCreador({
                    id_creador: idCreador,
                    id_incidencia: incidenciaActualizada.id_incidencia,
                    articulo: incidenciaActualizada.articulo
                });
            }
        } catch (notifErr) {
            console.error('[IncidenciasService] Error al generar notificación en sistema:', notifErr.message);
        }

        // --- Notificaciones por email según el nuevo estado ---
        try {
            const nuevoEstado = Number(input.id_estado);
            // Solo notificar si el estado cambió a Finalizada (3) o Cancelada (4)
            if ((nuevoEstado === 3 || nuevoEstado === 4) && incidenciaActualizada) {
                // Obtener el email del usuario que creó la incidencia
                const idCreador = incidenciaActualizada.creado_por
                    ?? incidenciaActualizada.id_creador;

                let emailDestinatario = null;
                if (idCreador) {
                    // Buscar por ID numérico si está disponible
                    const creadorUser = await User.getByID(idCreador).catch(() => null);
                    emailDestinatario = creadorUser?.usuario ?? null;
                }

                if (emailDestinatario) {
                    if (nuevoEstado === 3) {
                        // Finalizada → notificar con resumen de resolución
                        await MailService.sendIncidenciaFinalizada({
                            destinatario: emailDestinatario,
                            incidencia: incidenciaActualizada
                        });
                    } else if (nuevoEstado === 4) {
                        // Cancelada → notificar cancelación
                        await MailService.sendIncidenciaCancelada({
                            destinatario: emailDestinatario,
                            incidencia: incidenciaActualizada
                        });
                    }
                } else {
                    console.warn(`[IncidenciasService] No se encontró email para notificar la incidencia #${incidenciaActualizada.id_incidencia}.`);
                }
            }
        } catch (mailError) {
            // El error de email no debe interrumpir el flujo principal
            console.error('[IncidenciasService] Error durante notificación por email:', mailError.message);
        }

        return incidenciaActualizada;
    }

    static async create(input){
        console.log("Service");
        const resultado = await IncidenciasRepository.create(input);
        return await this.getByID(resultado.id_incidencia);
    }

    static async delete(input){
        console.log("Service");
        const resultado = await IncidenciasRepository.delete(input);
        if(resultado !== undefined){
            const estado = await IncidenciasEstadosRepository.create(resultado);
        }
        return await this.getByID(resultado);
    }

    static async getDashboardMetrics(){
        return await IncidenciasRepository.getDashboardMetrics();
    }
}