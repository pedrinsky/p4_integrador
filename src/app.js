import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';

const app = express();

//Middlewares globales
app.use(cors());
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
    res.send('Working');
});

//EMPLEADO SISTEMAS

//INCIDENCIAS
app.get('/api/v1/incidencias', async (req, res) => {
    try {
        //Paginación
        //Leemos los parámetros de la URL (si no vienen, asignamos valores por defecto después del OR)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 2;

        //Calculamos el desplazamiento
        const offset = (page - 1) * limit;

        const sql = 
        `SELECT 
            i.id_incidencia, 
            i.id_estado, 
            i.creado_por, 
            i.asignado_a, 
            i.creado, 
            i.prioridad,
            i.id_articulo, 
            a.descripcion AS articulo_descripcion,
            i.descripcion_pedido, 
            i.descripcion_resolucion
        FROM
            incidencias AS i
        INNER JOIN 
            articulos a ON i.id_articulo = a.id_articulo
        WHERE 
            i.id_estado != 4
        ORDER BY 
            i.id_incidencia DESC
        LIMIT $1 OFFSET $2;
        `;
    
        const { rows } = await pool.query(sql, [limit, offset]);
        
        //Consultar el total de registros para armar los botones de paginado
        const totalQuery = await pool.query('SELECT COUNT(*) FROM incidencias WHERE id_estado != 4;');
        const totalRegistros = parseInt(totalQuery.rows[0].count, 10);
        const totalPaginas = Math.ceil(totalRegistros / limit);
        
        res.status(200).json({
            incidencias: rows,
            paginacion: {
                totalRegistros,
                totalPaginas,
                paginaActual: page,
                limitePorPagina: limit
            }
        });

    } catch(error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({
            mensaje:'Error interno.'
        });
    }
});

app.patch('/api/v1/incidencias/:id', async (req, res) => {
    try {
        //Extraemos 'id' de req.params (equivale a: const id = req.params.id)
        const { id } = req.params;

        const sql = `
            UPDATE 
                incidencias 
            SET 
                id_estado = 3 
            WHERE 
                id_incidencia = $1 
            RETURNING *;
        `;

        const resultado = await pool.query(sql, [id]);

        console.log(`Se recibió solicitud para modificar la incidencia ${id}`);

        // Si el resultado no afectó a ninguna fila (rowCount === 0), respondemos 404
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'La incidencia no existe.' });
        }

        res.status(200).json({
            mensaje: 'Incidencia finalizada correctamente.',
            incidencia: resultado.rows[0]
        });

    } catch (error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});

app.listen(port, () => {
  console.log(`API Incidencias escuchando en ${port}`);
});

// CATEGORIAS - BREAD

//BROWSE
app.get('api/v1/categorias', async(req, res) => {
    try{
        const sql = 
        `SELECT
            c.id_categoria,
            c.descripcion,
            c.activo
        FROM
            categorias as c
        WHERE
            activo = 1
        ORDER BY
            descripcion ASC;`
        const { rows } = await pool.query(sql);
        console.log(rows);

        res.status(200).json({'categorias':rows});
    } catch (error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});