import { getAllArticulosSchema } from "../../schemas/articulosSchema.js";

export const getAllTransform = (req, res, next) => {
    const schema = getAllArticulosSchema.safeParse(req.query)
    console.log("Transformer");
    if(schema.error) res.status(400).json({error: JSON.parse(schema.error.message)});
    console.log(schema.data);
    req.criteria = schema.data;
    next();
}