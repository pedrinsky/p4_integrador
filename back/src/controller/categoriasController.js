import { pool } from '../config/db.js';

export const getCategorias = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id_categoria,
                c.descripcion,
                c.activo,
                c.descripcion as categoria_descripcion
            FROM categorias c
            ORDER BY c.id_categoria ASC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las categorias:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener los articulos' });
    }
};