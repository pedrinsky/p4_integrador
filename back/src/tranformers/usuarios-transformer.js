import { getByIDUsuariosSchema, updateUsuariosSchema,
    createUsuariosSchema} 
    from "../schemas/usuarios-schema.js";

export const getAllUsuariosTransform = (req, res, next) => {
    req.criteria = {};
    next();
}

export const getByIDUsuariosTransform = (req, res, next) => {
    const schema = getByIDUsuariosSchema.safeParse(req.params);
    
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    req.criteria = schema.data;
    next();
}

export const updateUsuariosTransform = (req, res, next) => {
    const bodySchema = updateUsuariosSchema.safeParse(req.body);
    const idSchema = getByIDUsuariosSchema.safeParse(req.params);
    if(bodySchema.error) return res.status(400).json({error: JSON.parse(bodySchema.error.message)});
    if(idSchema.error) return res.status(400).json({error: JSON.parse(idSchema.error.message)});
    req.criteria = {
        ...idSchema.data,
        ...bodySchema.data};
    next();
}

export const createUsuariosTransform = (req, res, next) => {
    const schema = createUsuariosSchema.safeParse(req.body);
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    req.criteria = schema.data;
    next();
}

export const deleteUsuariosTransform = (req, res, next) => {
    const schema = getByIDUsuariosSchema.safeParse(req.params);
    
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});
    req.criteria = schema.data;
    next();
}