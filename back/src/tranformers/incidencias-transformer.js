import { json } from "zod";
import { getAllIncidenciasSchema, getByIDIncidenciasSchema, updateIncidenciasSchema
    , createIncidenciasSchema} 
    from "../schemas/incidencias-schema.js";

export const getAllTransform = (req, res, next) => {
    const schema = getAllIncidenciasSchema.safeParse(req.query);
    console.log("Transformer");
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);

    const {
        page = 1,
        limit = 5,
        order_column = 'id_incidencia',
        direction = 'asc',
        estado,
        ...filtros
    } = schema.data;

    const offset = (page - 1) * limit;

    req.criteria = { 
        ...filtros, 
        id_estado: estado ?? filtros.id_estado,
        order_column, 
        direction, 
        limit, 
        offset 
    };
    next();
}

export const getByIDTransform = (req, res, next) => {
    console.log("Transformer");
    console.log(req.params);
    const schema = getByIDIncidenciasSchema.safeParse(req.params);
    
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}

export const updateTransform = (req, res, next) => {
    console.log("Transformer");
    const bodySchema = updateIncidenciasSchema.safeParse(req.body);
    const idSchema = getByIDIncidenciasSchema.safeParse(req.params);
    if(bodySchema.error) return res.status(400).json({error: JSON.parse(bodySchema.error.message)});
    if(idSchema.error) return res.status(400).json({error: JSON.parse(idSchema.error.message)});
    console.log(bodySchema.data);
    console.log(idSchema.data);
    req.criteria = {
        ...idSchema.data,
        ...bodySchema.data};
    console.log(req.criteria);
    next();
}

export const createTransform = (req, res, next) => {
    console.log("Transformer create");
    const body = { ...req.body };

    // Sanitización: si id_articulo no es un número válido > 0, se elimina para no disparar NaN
    const idArt = Number(body.id_articulo);
    if (!isNaN(idArt) && idArt > 0) {
        body.id_articulo = idArt;
    } else {
        delete body.id_articulo;
    }

    // Sanitización de creado_por y asignado_a
    const creadoPor = Number(body.creado_por);
    if (!isNaN(creadoPor) && creadoPor > 0) {
        body.creado_por = creadoPor;
    } else {
        delete body.creado_por;
    }

    const asignadoA = Number(body.asignado_a);
    if (!isNaN(asignadoA) && asignadoA > 0) {
        body.asignado_a = asignadoA;
    } else {
        // delete body.asignado_a;
        body.asignado_a = "";
    }

    // Prioridad por defecto 1 si no es válida
    const prioridad = Number(body.prioridad);
    body.prioridad = !isNaN(prioridad) ? prioridad : 1;

    delete body.id_estado;

    const schema = createIncidenciasSchema.safeParse(body);
    if (schema.error) {
        return res.status(400).json({ error: JSON.parse(schema.error.message) });
    }

    req.criteria = schema.data;
    next();
};

export const deleteTransform = (req, res, next) => {
    console.log("Transformer");
    console.log(req.params);
    const schema = getByIDIncidenciasSchema.safeParse(req.params);
    
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}