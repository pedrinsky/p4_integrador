import { Pool } from 'pg';
import dotenv from 'dotenv';

//Configuro dotenv para que pueda inyectar los valores de .env en la pool
dotenv.config();

//CONFIGURAR POOL DE CONEXIONES PARA ATENDER MULTIPLES PETICIONES CONCURRENTES
//USO process.env.(dato) PARA MANEJAR DATOS CON VARIABLES DE ENTORNO (dotenv se encarga de inyectar los datos que van)
export const pool = new Pool({
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

//Verificación de conexión inicial:
pool.query('SELECT NOW()')
    .then(() => console.log('🟢Conectado exitosamente a PostgreSQL'))
    .catch((err) => console.error('🔴Error al conectar a PostgreSQL:', err.message));