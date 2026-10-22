import { getAllIncidenciasSchema, getByIDIncidenciasSchema, updateIncidenciasSchema
    , createIncidenciasSchema} 
    from "../../schemas/incidencias-schema.js";

export const getAllTransform = (req, res, next) => {
    const schema = getAllIncidenciasSchema.safeParse(req.query)
    console.log("Transformer");
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}

export const getByIDTransform = (req, res, next) => {
    console.log("Transformer");
    console.log(req.params);
    const schema = getByIDIncidenciasSchema.safeParse(req.params);
    
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}

export const updateTransform = (req, res, next) => {
    console.log("Transformer");
    const bodySchema = updateIncidenciasSchema.safeParse(req.body);
    const idSchema = getByIDIncidenciasSchema.safeParse(req.params);
    if(bodySchema.error) res.status(400).json({error: JSON.parse(bodySchema.error.message)});
    if(idSchema.error) res.status(400).json({error: JSON.parse(idSchema.error.message)});
    console.log(bodySchema.data);
    console.log(idSchema.data);
    req.criteria = {
        ...idSchema.data,
        ...bodySchema.data};
    console.log(req.criteria);
    next();
}

export const createTransform = (req, res, next) => {
    console.log("Transformer");
    const schema = createIncidenciasSchema.safeParse(req.body);
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    console.log(req.criteria);
    next();
}

export const deleteTransform = (req, res, next) => {
    console.log("Transformer");
    console.log(req.params);
    const schema = getByIDIncidenciasSchema.safeParse(req.params);
    
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}