import { Pool } from 'pg';
import dotenv from 'dotenv';

import url from 'url';
import path from 'path';

// Configuro dotenv para que pueda inyectar los valores del root .env
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

//CONFIGURAR POOL DE CONEXIONES PARA ATENDER MULTIPLES PETICIONES CONCURRENTES
//USO process.env.(dato) PARA MANEJAR DATOS CON VARIABLES DE ENTORNO (dotenv se encarga de inyectar los datos que van)
export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

//Verificación de conexión inicial:
pool.query('SELECT NOW()')
    .then(() => console.log('🟢 Conectado exitosamente a PostgreSQL'))
    .catch((err) => console.error('🔴 Error al conectar a PostgreSQL:', err.message));