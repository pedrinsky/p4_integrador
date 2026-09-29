import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getIncidencias, finalizarIncidencia, reabrirIncidencia } from './controller/incidenciasController.js';
import { getArticulos } from './controller/articulosController.js';
import { getCategorias } from './controller/categoriasController.js';

// Cargar variables de entorno desde la raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Tus Endpoints (Rutas)
app.get('/api/incidencias', getIncidencias);
app.get('/api/articulos', getArticulos);
app.get('/api/categorias', getCategorias);
// La ruta espera un número (ID) dinámico usando los dos puntos :id
app.put('/api/incidencias/:id/finalizar', finalizarIncidencia);
app.put('/api/incidencias/:id/reabrir', reabrirIncidencia);


// Ruta básica de prueba
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            status: 'success', 
            message: '🎉 V2 Backend conectado a PostgreSQL correctamente', 
            time: result.rows[0].now 
        });
    } catch (error) {
        console.error('Error de base de datos:', error);
        res.status(500).json({ error: 'Error interno del servidor con la base de datos' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});
