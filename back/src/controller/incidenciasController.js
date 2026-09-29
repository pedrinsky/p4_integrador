import { pool } from '../config/db.js';

export const getIncidencias = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                i.id_incidencia,
                TO_CHAR(i.creado, 'DD/MM/YYYY') as creado,
                a.descripcion as articulo_descripcion,
                i.descripcion_pedido,
                i.prioridad,
                i.id_estado
            FROM incidencias i
            JOIN articulos a ON i.id_articulo = a.id_articulo
            ORDER BY 
                CASE WHEN i.id_estado >= 3 THEN 1 ELSE 0 END ASC,
                i.id_incidencia ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener incidencias:', error);
        res.status(500).json({ error: 'Error del servidor al obtener incidencias' });
    }
};

export const finalizarIncidencia = async (req, res) => {
    const idIncidencia = req.params.id;
    const { descripcion_resolucion } = req.body || {}; // Atrapamos la descripción opcional
    
    try{ //le ordena a postgre que actualice esa la fila del dato
        const query = `
            UPDATE incidencias 
            SET id_estado = 3,
                descripcion_resolucion = $2
            WHERE id_incidencia = $1
        `; //el estado 3 es el resuelto
        await pool.query(query, [idIncidencia, descripcion_resolucion || null]);
        //mensaje de respuesta de exito
        res.json({ message: 'Incidencia finalizada con éxito'});
    } catch (e){
        res.status(500).json({ e: 'Error al actualizar'});
    }
};

export const reabrirIncidencia = async (req, res) => {
    const idIncidencia = req.params.id;
    try{ 
        const query = `
            UPDATE incidencias 
            SET id_estado = 1,
                descripcion_resolucion = NULL
            WHERE id_incidencia = $1
        `; // Pasamos a Pendiente
        await pool.query(query, [idIncidencia]);
        res.json({ message: 'Incidencia reabierta con éxito'});
    } catch (e){
        res.status(500).json({ e: 'Error al reabrir la incidencia'});
    }
};