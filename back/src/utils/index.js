import express from 'express';
import cors from 'cors';
import { pool } from '../config/db.js';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Working');
});

const middleIncidencias = (req, res, next) => {
    try{
        const {idIncidencia, idArticulo, idEstado
            , creadoPor, asignadoA, creado, prioridad
            , descripcionPedido, descripcionRes} = req.query;
        
        let valor;
        let filtro;
        
        if(idIncidencia){
            filtro = "i.id_incidencia = $1";
            valor = idIncidencia;
        }else if(idArticulo){
            filtro = "i.id_articulo = $1";
            valor = idArticulo;
        }else if(idEstado){
            filtro = "i.id_estado = $1";
            valor = idEstado;
        }else if(creadoPor){
            filtro = "i.creado_por = $1";
            valor = creadoPor;
        }else if(asignadoA){
            filtro = "i.asignado_a = $1";
            valor = asignadoA;
        }else if(creado){
            filtro = "i.creado::date = $1";
            valor = creado;
        }else if(prioridad){
            filtro = "i.prioridad = $1";
            valor = prioridad;
        }else if(descripcionPedido){
            filtro = "i.descripcion_pedido ILIKE $1";
            valor = "%" + descripcionPedido + "%";
        }else if(descripcionRes){
            filtro = "i.descripcion_respuesta ILIKE $1";
            valor = "%" + descripcionRes + "%";
        }
        
        if(valor) req.valor = valor;
        if(filtro) req.filtro = filtro;

        next();

    }catch(error){
        console.error(error);
    }
}


//endpoint de incidencias para empleado de sistemas

// app.get('/incidencias', async (req, res) => {
//     const asignado = 1;
//     try {
//         const sql = `SELECT 
//             i.id_incidencia, i.creado, i.creado_por, i.id_articulo
//             , i.descripcion_pedido, i.descripcion_resolucion, i.id_estado
//             , i.prioridad
//         FROM 
//             incidencias AS i
//         WHERE
//             i.id_estado != 4 AND i.asignado_a = $1
//         ORDER BY     
//             i.id_incidencia DESC;`;
    
//         const {rows} = await pool.query(sql, [asignado]);
//         console.log(rows);
//         res.status(200).json({'incidencias':rows});
//     } catch(error) {
//         console.log(`Paso algo -> ${error}`);
//         res.status(500).json({'error':'Error interno.'});
//     }
// });


//endpoint de incidencias para Director
app.get('/incidencias',middleIncidencias , async (req, res) => {
    try {
        let sql = `SELECT 
            i.id_incidencia, i.creado, i.creado_por, i.id_articulo, i.descripcion_pedido
            , i.descripcion_resolucion, i.id_estado, i.prioridad, i.asignado_a
        FROM 
            incidencias AS i
        WHERE
            i.id_estado != 4`;

        if(req.filtro && req.valor){
            sql += " AND " + req.filtro + " ORDER BY i.id_incidencia DESC;";
            console.log(sql);
            const {rows} = await pool.query(sql, [req.valor]);
            res.status(200).json({'incidencias':rows});
        }else{
            sql += " ORDER BY i.id_incidencia DESC;";
            const {rows} = await pool.query(sql);
            console.log(sql);
            res.status(200).json({'incidencias':rows});
        }
    } catch(error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});



//Prueba de endpoint de incidencias para empleado municipal

// app.get('/incidencias', async (req, res) => {
//     try {
//         const sql = `SELECT 
//             i.id_incidencia , i.creado, art.descripcion as articulo, i.descripcion_pedido
//             , e.descripcion as estado
//         FROM 
//             incidencias AS i
//         LEFT JOIN 
//             articulos art 
//         ON 
//             i.id_articulo = art.id_articulo
//         INNER JOIN
//             estados e
//         ON
//             i.id_estado = e.id_estado
//         WHERE 
//             i.id_estado != 4
//         ORDER BY 
//             i.id_incidencia DESC;`;
    
//         const {rows} = await pool.query(sql);
//         console.log(rows);
//         res.status(200).json({'incidencias':rows});
//     } catch(error) {
//         console.log(`Paso algo -> ${error}`);
//         res.status(500).json({'error':'Error interno.'});
//     }
// });


//---------------ARTICULOS---------------

// Prueba de end point de articulos para empleado de sistemas

app.get('/articulos', async (req, res) => {
    try {
        let sql = `SELECT 
                    art.id_articulo as id, art.descripcion as descripcion, areas.descripcion as area
                    , cat.descripcion as categoria
                FROM 
                    articulos art
                INNER JOIN 
                    areas
                ON
                    art.id_area = areas.id_area
                INNER JOIN
                    categorias cat
                ON
                    art.id_categoria = cat.id_categoria;`;
    
            const {rows} = await pool.query(sql);
            console.log(rows);
            res.status(200).json({'articulos':rows});
    
        
    } catch(error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});


//Prueba de endpoint de articulos para empleado municipal

app.get('/articulos', async (req, res) => {
    const area = 1;
    try {

        let sql = `SELECT 
                    art.id_articulo as id, art.descripcion as descripcion
                FROM 
                    articulos art
                WHERE art.id_area = $1;`;

        const {rows} = await pool.query(sql, [area]);
        console.log(rows);
        res.status(200).json({'articulos':rows});
        
    } catch(error) {
        console.log(`Paso algo -> ${error}`);
        res.status(500).json({'error':'Error interno.'});
    }
});


// End point completo de articulos que diferencia roles
//Devuelve una lista de los articulos, dando diferentes datos segun el usuario y/o su area

// app.get('/articulos', async (req, res) => {
//     const {rol, area} = req;
//     try {
//         if(rol === 1){
//             let sql = `SELECT 
//                         art.id_articulo as id, art.descripcion as descripcion
//                     FROM 
//                         articulos art
//                     WHERE art.id_area = $0;`;
    
//             const {rows} = await pool.query(sql, [area]);
//             console.log(rows);
//             res.status(200).json({'articulos':rows});
//         }else if(rol === 2){
//             let sql = `SELECT 
//                         art.id_articulo as id, art.descripcion as descripcion, areas.descripcion as area
//                         , cat.descripcion as categoria
//                     FROM 
//                         articulos art
//                     INNER JOIN 
//                         areas
//                     ON
//                         art.id_area = areas.id_area
//                     INNER JOIN
//                         categorias cat
//                     ON
//                         art.id_categoria = cat.id_categoria;`;
    
//             const {rows} = await pool.query(sql);
//             console.log(rows);
//             res.status(200).json({'articulos':rows});
//         }
        
//     } catch(error) {
//         console.log(`Paso algo -> ${error}`);
//         res.status(500).json({'error':'Error interno.'});
//     }
// });



app.listen(port, () => {
  console.log(`API Incidencias escuchando en ${port}`);
});