import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { swaggerUi, swaggerDocs } from '../config/swagger.js';
import { createArticulosRouter } from '../routers/articulosRouters.js';
import { ArticulosService } from '../services/articulos-service.js';
import { createCategoriasRouter } from '../routers/categoriaRouters.js';
import { CategoriasService } from "../services/categorias-service.js";
import { createIncidenciasRouter } from '../routers/incidenciasRouters.js';
import { IncidenciasService } from '../services/incidencias-service.js';
import rateLimit from 'express-rate-limit';
import { UsersService } from '../services/users-services.js'
import { createUser as createUsuariosRouter } from '../routers/usuarios-routes.js'
import authRouter from '../routers/auth-routers.js'
import { createNotificacionesRouter } from '../routers/notificacionesRouters.js'
import authenticate from '../middleware/authenticate.js';

const app = express();
const port = 3000;

// Middleware de registro de solicitudes HTTP (Morgan)
app.use(morgan('dev'));

//limite para que un bot no baje la pagina al hacer miles de solicitudes por seg
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //ventana de 15 minutos
    max: 100,                  //máximo 100 requests por IP en esa ventana
    message: { error: 'Demasiadas solicitudes, intente más tarde.' }
});

app.use('/api', limiter); //aplica a las rutas /api

//middlewares globales
app.use(cors());
app.use(express.json());

// Documentación interactiva de Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//AUTH
app.use("/api", authRouter);

app.use(authenticate);

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

//NOTIFICACIONES
app.use("/api/notificaciones", createNotificacionesRouter());


//arranque
app.listen(port, () => {
  console.log(`API Incidencias escuchando en http://localhost:${port}`);
  console.log(`Documentación Swagger disponible en http://localhost:${port}/api/docs`);
});
