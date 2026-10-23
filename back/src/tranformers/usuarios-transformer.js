import { getByIDUsuariosSchema, updateUsuariosSchema,
    createUsuariosSchema} 
    from "../schemas/usuarios-schema.js";

export const getAllUsuariosTransform = (req, res, next) => {
    console.log("Transformer");
    req.criteria = {};
    next();
}

export const getByIDUsuariosTransform = (req, res, next) => {
    console.log("Transformer");
    console.log(req.params);
    const schema = getByIDUsuariosSchema.safeParse(req.params);
    
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}

export const updateUsuariosTransform = (req, res, next) => {
    console.log("Transformer");
    const bodySchema = updateUsuariosSchema.safeParse(req.body);
    const idSchema = getByIDUsuariosSchema.safeParse(req.params);
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

export const createUsuariosTransform = (req, res, next) => {
    console.log("Transformer");
    const schema = createUsuariosSchema.safeParse(req.body);
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    console.log(req.criteria);
    next();
}

export const deleteUsuariosTransform = (req, res, next) => {
    console.log("Transformer");
    console.log(req.params);
    const schema = getByIDUsuariosSchema.safeParse(req.params);
    
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}