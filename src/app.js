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

// INCIDENCIAS 
app.get('/api/v1/incidencias', async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search ? req.query.search.trim() : '';

        //Calculamos el desplazamiento
        const offset = (page - 1) * limit;

        let paramEstado = 'WHERE i.id_estado != 4';
        const params = [];

        
        //ILIKE insensible a mayusculas, si hay búsqueda se actualiza la cláusula
        if (search !== '') {
            params.push(`%${search}%`);
            paramEstado += ` AND a.descripcion ILIKE $${params.length}`;
        }

        // 1. Contar el total de registros filtrados (requiere el JOIN para evaluar a.descripcion)
        const rowsSql = `
            SELECT 
                COUNT(*) 
            FROM 
                incidencias AS i
            INNER JOIN articulos AS a ON i.id_articulo = a.id_articulo
            ${paramEstado};
        `;

        const totalQuery = await pool.query(rowsSql, params);
        const totalRegistros = parseInt(totalQuery.rows[0].count, 10);
        const totalPaginas = Math.ceil(totalRegistros / limit) || 1;

        //Parámetros para la paginación
        params.push(limit);
        const limitPos = params.length;

        params.push(offset);
        const offsetPos = params.length;

        const sql = `
            SELECT 
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
            FROM incidencias AS i
            INNER JOIN articulos AS a ON i.id_articulo = a.id_articulo
            ${paramEstado}
            ORDER BY i.id_incidencia DESC
            LIMIT $${limitPos} OFFSET $${offsetPos};
        `;

        const { rows } = await pool.query(sql, params);

        res.status(200).json({
            incidencias: rows,
            paginacion: {
                totalRegistros,
                totalPaginas,
                paginaActual: page,
                limitePorPagina: limit
            }
        });

    } catch (error) {
        console.error(`Error en GET incidencias -> ${error}`);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
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

// CATEGORIAS - BREAD

//BROWSE
app.get('/api/v1/categorias', async(req, res) => {
    try{
        //Paginación
        //Leemos los parámetros de la URL (si no vienen, asignamos valores por defecto después del OR)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search ? req.query.search.trim() : '';

        //Calculamos el desplazamiento
        const offset = (page - 1) * limit;

        let paramActivo = 'WHERE activo = 1';
        const params = [];

        //ILIKE insensible a mayusculas, si hay búsqueda se actualiza la cláusula
        if (search !== ''){
            params.push(`%${search}%`);
            paramActivo += ` AND descripcion ILIKE $${params.length}`;
        }
        const rowsSql = `
            SELECT 
                COUNT(*) 
            FROM 
                categorias ${paramActivo};`
        //Consultar el total de registros para armar los botones de paginado
        const totalQuery = await pool.query(rowsSql, params);
        const totalRegistros = parseInt(totalQuery.rows[0].count, 10);
        const totalPaginas = Math.ceil(totalRegistros / limit) || 1;

        //Parámetros para la paginación
        params.push(limit);
        const limitPos = params.length;

        params.push(offset);
        const offsetPos = params.length;

        const sql = 
        `SELECT
            c.id_categoria,
            c.descripcion,
            c.activo
        FROM
            categorias as c
        ${paramActivo}
        ORDER BY
            descripcion ASC
        LIMIT $${limitPos} OFFSET $${offsetPos};`
        ;
        const { rows } = await pool.query(sql, params);
        
        
        

        res.status(200).json({
            categorias: rows,
            paginacion: {
                totalRegistros,
                totalPaginas,
                paginaActual: page,
                limitePorPagina: limit
            }
        });

    } catch (error) {
        console.log(`Error en GET categorías -> ${error}`);
        res.status(500).json({'error':'Error interno del servidor.'});
    }
});

//READ
app.get('/api/v1/categorias/:id', async (req, res) => {
    try {
        //Extraemos 'id' de req.params (equivale a: const id = req.params.id)
        const { id } = req.params;

        const sql = 
        `SELECT
            c.id_categoria,
            c.descripcion,
            c.activo
        FROM
            categorias as c
        WHERE
            id_categoria = $1;
        `;

        const resultado = await pool.query(sql, [id]);

        console.log(`Se recibió solicitud para ver la categoria ${id}`);

        // Si el resultado no afectó a ninguna fila (rowCount === 0), respondemos 404
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'La categoría no existe.' });
        }

        res.status(200).json({
            mensaje: 'Categoria mostrada correctamente.',
            categoria: resultado.rows[0]
        });

    } catch (error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});

//EDIT (put)
app.put('/api/v1/categorias/:id', async (req, res) => {
    try {
        //Extraemos 'id' de req.params (equivale a: const id = req.params.id)
        const { id } = req.params;
        const { descripcion } = req.body;

        if (!descripcion || descripcion.trim() === ''){
            return res.status(400).json({ error: 'La descripción no puede estar vacía.' });
        }

        const sql = 
        `UPDATE
            categorias
        SET
            descripcion = $1
        WHERE
            id_categoria = $2
        RETURNING *;
        `;

        const resultado = await pool.query(sql, [descripcion.trim(), id]);

        console.log(`Se recibió solicitud para editar la categoria ${id}`);

        // Si el resultado no afectó a ninguna fila (rowCount === 0), respondemos 404
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'La categoría no existe.' });
        }

        res.status(200).json({
            mensaje: 'Categoria mostrada correctamente.',
            categoria: resultado.rows[0]
        });

    } catch (error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});

//ADD (post)
app.post('/api/v1/categorias', async (req, res) => {
    try {
        const { descripcion } = req.body;

        if (!descripcion || descripcion.trim() === ''){
            return res.status(400).json({ error: 'La descripción no puede estar vacía.' });
        }

        const sql = 
        `INSERT INTO
            categorias (descripcion, activo)
        VALUES 
            ($1, 1) 
        RETURNING *;
        `;
        //se asume que al insertar una categoría se inserta como activo(true), por eso se pasó VALUES ($1, 1)
        
        const { rows } = await pool.query(sql, [descripcion.trim()]);

        res.status(200).json({
            mensaje: 'Categoria creada correctamente.',
            categoria: rows[0]
        });

    } catch (error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});

//DELETE (lógico)
app.delete('/api/v1/categorias/:id', async (req, res) => {
    try {
        //Extraemos 'id' de req.params (equivale a: const id = req.params.id)
        const { id } = req.params;

        const sql = 
        `UPDATE
            categorias
        SET
            activo = 0
        WHERE
            id_categoria = $1
        RETURNING *;
        `;

        const resultado = await pool.query(sql, [id]);

        console.log(`Se recibió solicitud para borrar la categoria ${id}`);

        // Si el resultado no afectó a ninguna fila (rowCount === 0), respondemos 404
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'La categoría no existe.' });
        }
        res.status(200).json({
            mensaje: 'Categoria borrada correctamente.',
            categoria: resultado.rows[0]
        });

    } catch (error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});

app.listen(port, () => {
  console.log(`API escuchando en ${port}`);
});