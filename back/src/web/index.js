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

import rateLimit from 'express-rate-limit';

const app = express();
const port = 3000;

//middlewares globales
app.use(cors());
app.use(express.json());

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

//arranque
app.listen(port, () => {
  console.log(`API Incidencias escuchando en ${port}`);
});

//limite para que un bot no baje la pagina al hacer miles de solicitudes por seg
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //ventana de 15 minutos
    max: 100,                  //máximo 100 requests por IP en esa ventana
    message: { error: 'Demasiadas solicitudes, intente más tarde.' }
});

app.use('/api', limiter); //aplica a las rutas /api

//Manejador global de errores (siempre al final)
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});
