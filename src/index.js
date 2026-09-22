import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';

const app = express();
app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
    res.send('Working');
});

app.get('/incidencias', async (req, res) => {
    try {
        const sql = `SELECT 
            i.id_incidencia, i.id_estado, i.creado_por, i.asignado_a, i.creado, i.prioridad,
            i.id_articulo, a.descripcion AS articulo_descripcion, i.descripcion_pedido, i.descripcion_resolucion
        FROM 
            incidencias AS i
        INNER JOIN articulos a ON i.id_articulo = a.id_articulo
        WHERE i.id_estado != 4
        ORDER BY i.id_incidencia DESC;`;
    
        const {row} = await pool.query(sql);
        console.log(row);
        res.status(200).json({'incidencias':row});
    } catch(error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});

app.listen(port, () => {
  console.log(`API Incidencias escuchando en ${port}`);
});