import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// IMPORT ROUTERS
import { createIncidenciasRouter } from '../routers/incidenciasRouters.js';
import { createArticulosRouter } from '../routers/articulosRouters.js';
import { createCategoriasRouter } from '../routers/categoriaRouters.js';

// IMPORT SERVICES
import { IncidenciasService } from './services/incidencias.service.js';
import { ArticulosService } from './services/articulos.service.js';
import { CategoriasService } from './services/categorias.service.js';
import { getEmpleadosSistemas } from './controller/usuariosController.js'; // Legacy por ahora

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// INYECCION DE CARPETAS Y MVC
app.use('/api/incidencias', createIncidenciasRouter({ incidenciasService: IncidenciasService }));
app.use('/api/articulos', createArticulosRouter({ articulosService: ArticulosService }));
app.use('/api/categorias', createCategoriasRouter({ categoriasService: CategoriasService }));

// Legacy
app.get('/api/usuarios/sistemas', getEmpleadosSistemas);

// Ruta básica de prueba
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            status: 'success', 
            message: '🎉 V2 Backend conectado a PostgreSQL (MVC)', 
            time: result.rows[0].now 
        });
    } catch (error) {
        console.error('Error de BD:', error);
        res.status(500).json({ error: 'Internal DB Error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend MVC corriendo en http://localhost:${PORT}`);
});
