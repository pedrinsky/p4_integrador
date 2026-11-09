export class IncidenciasController {
    constructor({ incidenciasService }) {
        this.incidenciasService = incidenciasService;
    }

    getAll = async (req, res) => {
        try {
            console.log("Controller");
            const result = await this.incidenciasService.getAll(req.dto || req.query);
            console.log(result);
            res.json(result);
        } catch (error) {
           res.status(500).json({ error: error.message });
        }
    }

    getByID = async (req, res) => {
        try {
            console.log("Controller");
            const result = await this.incidenciasService.getByID(req.dto);
            console.log(result);
            res.json(result);
        } catch (error) {
           res.status(500).json({ error: error.message });
        }
    }

    update = async (req, res) => {
        try {
            console.log("Controller");
            const result = await this.incidenciasService.update(req.dto);
            console.log(result);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    create = async (req, res) => {
        try {
            console.log("Controller");
            const result = await this.incidenciasService.create(req.dto);
            console.log(result);
            res.json(result);
        } catch (error) {
           res.status(500).json({ error: error.message });
        }
    }

    delete = async (req, res) => {
        try {
            console.log("Controller");
            const result = await this.incidenciasService.delete(req.dto);
            console.log(result);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    //Seguir aca
    finalizar = async (req, res) => {
        try {
            console.log("Controller");
            //<<Pasar a transform  
            const id_incidencia = req.params.id_incidencia;
            const { descripcion_resolucion } = req.body || {}; 
            await this.incidenciasService.update({ 
                id_incidencia, 
                id_estado: 3, 
                descripcion_resolucion 
            });
            //>>
            res.json({ message: 'Incidencia finalizada con éxito'});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    reabrir = async (req, res) => {
        try {
            const id_incidencia = req.params.id_incidencia;
            //<<Pasar a transform 
            await this.incidenciasService.update({ 
                id_incidencia, 
                id_estado: 1, 
                descripcion_resolucion: null 
            });
            //>>
            res.json({ message: 'Incidencia reabierta con éxito'});
        } catch (error) {
             res.status(500).json({ error: error.message });
        }
    }
}