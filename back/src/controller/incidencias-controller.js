import {IncidenciasResponseDTO} from  "../dto/incidencias-dto.js";

export class IncidenciasController {
    constructor({ incidenciasService }) {
        this.incidenciasService = incidenciasService;
    }

    getAll = async (req, res) => {
        try {
            const result = await this.incidenciasService.getAll(req.criteria || req.query);
            const limit = Number(req.criteria?.limit) || 5;
                    const totalRegistros = result.length > 0 && result[0].total_registros 
                        ? parseInt(result[0].total_registros, 10) 
                        : result.length;
                    const totalPaginas = Math.ceil(totalRegistros / limit) || 1;
                    const paginaActual = Number(req.criteria?.page) || (Math.floor(Number(req.criteria?.offset || 0) / limit) + 1);
            
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
            res.status(500).json({ error: error.message });
        }
    }

    create = async (req, res) => {
        try {
            const result = await this.incidenciasService.create(req.criteria);
            res.json(result);
        } catch (error) {
           res.status(500).json({ error: error.message });
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

    reabrir = async (req, res) => {
        try {
            const id_incidencia = req.params.id_incidencia;
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
}