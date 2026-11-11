import { getAllArticulosSchema, getByIDArticulosSchema
    ,updateArticulosSchema, createArticulosSchema} from "../schemas/articulos.schemas.js";

export const getAllTransform = (req, res, next) => {
    const schema = getAllArticulosSchema.safeParse(req.query);
    if(schema.error) return res.status(400).json({error: JSON.parse(schema.error.message)});

    const {
        page = 1,
        limit = 5,
        order_column = 'id_articulo',
        direction = 'asc',
        ...filtros
    } = schema.data;

    const offset = (page - 1) * limit;

    req.criteria = { ...filtros, order_column, direction, limit, offset };
    next();
}

export const getByIDTransform = (req, res, next) => {
    const schema = getByIDArticulosSchema.safeParse(req.params);
    
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    req.criteria = schema.data;
    next();
}

export const updateTransform = (req, res, next) => {
    const bodySchema = updateArticulosSchema.safeParse(req.body);
    const idSchema = getByIDArticulosSchema.safeParse(req.params);
    if(bodySchema.error) res.status(400).json({error: JSON.parse(bodySchema.error.message)});
    if(idSchema.error) res.status(400).json({error: JSON.parse(idSchema.error.message)});
    req.criteria = {
        ...idSchema.data,
        ...bodySchema.data};
    next();
}

export const createTransform = (req, res, next) => {
    const schema = createArticulosSchema.safeParse(req.body);
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    req.criteria = schema.data;
    next();
}

export const deleteTransform = (req, res, next) => {
    const schema = getByIDArticulosSchema.safeParse(req.params);
    
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    req.criteria = schema.data;
    next();
}