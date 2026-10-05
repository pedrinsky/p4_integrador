import express from 'express';
import cors from 'cors';
import { createArticulosRouter } from '../routes/articulos-routes.js';
import { ArticulosService } from '../services/articulos-service.js';
import { createCategoriasRouter } from '../routes/categorias-routes.js';
import { CategoriasService } from "../services/categorias-service.js";

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Working');
});

//---------------ARTICULOS---------------
app.use("/articulos", createArticulosRouter({articulosService : ArticulosService}));

//---------------CATEGORIAS---------------
app.use("/categorias", createCategoriasRouter({categoriasService : CategoriasService}));


app.listen(port, () => {
  console.log(`API Incidencias escuchando en ${port}`);
});