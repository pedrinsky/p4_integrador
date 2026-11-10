import {IncidenciasResponseDTO} from  "../dto/incidencias-dto.js";
import { PdfService } from "../services/pdf-service.js";
import { NotificacionesService } from "../services/notificaciones-service.js";

export class IncidenciasController {
    constructor({ incidenciasService }) {
        this.incidenciasService = incidenciasService;
    }

    getAll = async (req, res) => {
        try {
            const criterios = { ...(req.criteria || req.query) };
            const usuarioAutenticado = req.usuario || req.user;

            // Verificación y aplicación de restricciones por Rol
            if (usuarioAutenticado) {
                const rol = Number(usuarioAutenticado.rol ?? usuarioAutenticado.id_rol);
                const idUsuario = usuarioAutenticado.id_usuario ?? usuarioAutenticado.id;

                // 1. Empleado Municipal (rol 2): Solo ve sus propias incidencias creadas
                if (rol === 2 || String(usuarioAutenticado.rol).toLowerCase().includes('municipal')) {
                    criterios.creado_por = idUsuario;
                }
                // 2. Empleado de Sistemas (rol 3): Solo ve las incidencias que tiene asignadas
                else if (rol === 3 || String(usuarioAutenticado.rol).toLowerCase().includes('sistema')) {
                    criterios.asignado_a = idUsuario;
                }
                // 3. Director (rol 1): No se aplican restricciones, puede ver y filtrar todas
            }

            const result = await this.incidenciasService.getAll(criterios);
            const limit = Number(criterios.limit) || 5;
            const totalRegistros = result.length > 0 && result[0].total_registros 
                ? parseInt(result[0].total_registros, 10) 
                : result.length;
            const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
            const paginaActual = Number(criterios.page) || (Math.floor(Number(criterios.offset || 0) / limit) + 1);
    
            const incidenciaDTO = result.map(incidencia => new IncidenciasResponseDTO(incidencia));
    
            res.json({
                incidencias: incidenciaDTO,
                paginacion: {
                    totalPaginas,
                    paginaActual,
                    totalRegistros,
                    limitePorPagina: limit
                }
            });
        } catch (error) {
           res.status(500).json({ error: error.message });
        }
    }

    getByID = async (req, res) => {
        try {
            const result = await this.incidenciasService.getByID(req.criteria);
            res.json(result ? new IncidenciasResponseDTO(result) : null);
        } catch (error) {
           res.status(500).json({ error: error.message });
        }
    }

    update = async (req, res) => {
        try {
            const result = await this.incidenciasService.update(req.criteria);
            res.json(result);
        } catch (error) {
            const status = error.statusCode || 400;
            res.status(status).json({ error: error.message });
        }
    }

    create = async (req, res) => {
        try {
            if (res.headersSent) return;

            const criterios = { ...req.criteria };
            const usuarioAutenticado = req.user || req.usuario;
            if (usuarioAutenticado && !criterios.creado_por) {
                criterios.creado_por = usuarioAutenticado.id_usuario ?? usuarioAutenticado.id;
            }

            const result = await this.incidenciasService.create(criterios);
            if (!res.headersSent) {
                return res.json(result);
            }
        } catch (error) {
            console.error("Error en IncidenciasController.create:", error);
            if (!res.headersSent) {
                return res.status(500).json({ error: error.message });
            }
        }
    }

    delete = async (req, res) => {
        try {
            const result = await this.incidenciasService.delete(req.criteria);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    finalizar = async (req, res) => {
        try {
            const id_incidencia = req.params.id_incidencia;
            const { descripcion_resolucion } = req.body || {}; 
            await this.incidenciasService.update({ 
                id_incidencia, 
                id_estado: 3, 
                descripcion_resolucion 
            });
            res.json({ message: 'Incidencia finalizada con éxito'});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    solicitarReapertura = async (req, res) => {
        try {
            const id_incidencia = req.params.id_incidencia;
            const incActual = await this.incidenciasService.getByID(id_incidencia);

            if (!incActual) {
                return res.status(404).json({ error: "Incidencia no encontrada." });
            }

            // Identificar al técnico de sistemas asignado
            const idTecnico = incActual.id_asignado || incActual.asignado_a;
            if (!idTecnico) {
                return res.status(400).json({ error: "La incidencia no tiene un técnico asignado para notificar." });
            }

            // Enviar notificación exclusivamente al técnico de sistemas a cargo (la incidencia NO se reabre aún)
            await NotificacionesService.notificarReapertura({
                id_tecnico: idTecnico,
                id_incidencia,
                articulo: incActual.articulo
            });

            return res.json({ message: "Solicitud de reapertura enviada al técnico a cargo." });
        } catch (error) {
            console.error("Error en solicitarReapertura:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    reabrir = async (req, res) => {
        try {
            const id_incidencia = req.params.id_incidencia;
            
            // Reabrir incidencia devolviéndola a Pendiente (id_estado = 1)
            // IncidenciasService.update se encargará de notificar al empleado municipal creador
            await this.incidenciasService.update({ 
                id_incidencia, 
                id_estado: 1, 
                descripcion_resolucion: null 
            });

            res.json({ message: 'Incidencia reabierta con éxito'});
        } catch (error) {
             res.status(500).json({ error: error.message });
        }
    }

    getDashboardMetrics = async (req, res) => {
        try {
            const metrics = await this.incidenciasService.getDashboardMetrics();
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    generarReportePDF = async (req, res) => {
        try {
            console.log("Controller generarReportePDF");
            const [metrics, todas] = await Promise.all([
                this.incidenciasService.getDashboardMetrics(),
                this.incidenciasService.getAll({ limit: 100 })
            ]);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="reporte-incidencias.pdf"');

            PdfService.generarReporteIncidencias({
                totales: metrics.totales,
                incidencias: todas,
                usuario: req.user || req.usuario
            }, res);
        } catch (error) {
            console.error("Error al generar PDF:", error);
            res.status(500).json({ error: "Error al generar el reporte en PDF." });
        }
    }
}