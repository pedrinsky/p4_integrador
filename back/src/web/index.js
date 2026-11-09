import express from 'express';
import cors from 'cors';

import { createArticulosRouter } from '../routers/articulos.router.js';
import { createCategoriasRouter } from '../routers/categorias.router.js';
import { createIncidenciasRouter } from '../routers/incidencias.router.js';
import { createUser as createUsuariosRouter } from '../routers/usuarios.router.js';
import authRouter from '../routers/auth.router.js';

import { ArticulosService } from '../services/articulos.service.js';
import { CategoriasService } from "../services/categorias.service.js";
import { IncidenciasService } from '../services/incidencias.service.js';
import { UsersService } from '../services/users.service.js';

import { limiter } from '../middleware/limiter.js';
import morgan from 'morgan';
import { corsOption } from '../cors/cors.options.js';

const app = express();
const port = 3000;

//middlewares globales
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use('/api', limiter); //aplica a las rutas /api

app.get('/api', (req, res) => {
    res.send('Working');
});

//ARTICULOS
app.use("/api/articulos", createArticulosRouter({articulosService : ArticulosService}));

//CATEGORIAS
app.use("/api/categorias", createCategoriasRouter({categoriasService : CategoriasService}));

//INCIDENCIAS
app.use("/api/incidencias", createIncidenciasRouter({incidenciasService : IncidenciasService}));
//USUARIOS
app.use("/api/usuarios", createUsuariosRouter({usuariosService: UsersService}))

//AUTH
app.use("/api", authRouter);

//Manejador global de errores (siempre al final)
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

//arranque
app.listen(port, () => {
  console.log(`API Incidencias escuchando en ${port}`);
});

