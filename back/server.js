import express from 'express';
import cors from 'cors';
import { createArticulosRouter } from './src/routes/articulos.routes.js';
import { createCategoriasRouter } from './src/routes/categorias.routes.js';
import { createIncidenciasRouter } from './src/routes/incidencias.routes.js';

import { ArticulosService } from './src/services/articulos.service.js';
import { CategoriasService } from "./src/services/categorias.service.js";
import { IncidenciasService } from './src/services/incidencias.service.js';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get('/api', (req, res) => {
    res.send('Working');
});

//---------------ARTICULOS---------------
app.use("/api/articulos", createArticulosRouter({articulosService : ArticulosService}));

//---------------CATEGORIAS---------------
app.use("/api/categorias", createCategoriasRouter({categoriasService : CategoriasService}));

//---------------INCIDENCIAS---------------
app.use("/api/incidencias", createIncidenciasRouter({incidenciasService : IncidenciasService}));


app.listen(port, () => {
  console.log(`API Incidencias escuchando en ${port}`);
});