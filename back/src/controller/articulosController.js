import { pool } from '../config/db.js';

export const getArticulos = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id_articulo,
                a.id_area,
                a.id_categoria,
                a.descripcion,
                a.activo,
                ar.descripcion as area_descripcion,
                c.descripcion as categoria_descripcion
            FROM articulos a
            LEFT JOIN areas ar ON a.id_area = ar.id_area
            LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
            ORDER BY a.id_articulo ASC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los articulos:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener los articulos' });
    }
};
