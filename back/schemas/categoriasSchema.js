import z from 'zod';

const order = ["id_categoria", "descripcion", "activo"];

export const getAllCategoriasSchema = z.object({
    "id_categoria": z.coerce
        .number()
        .int({message: "id_categoria debe ser un entero"})
        .optional(),
    "descripcion": z.string({message: "descripcion debe ser un string"})
        .optional(),
    "activo": z.coerce.number().int({message: "activo debe ser un entero"})
        .optional(),
    "order_column": z.enum(order, {message: "Valor invalido para order_column"}).default("id_categoria"),
    "direction": z.enum(["ASC", "asc", "DESC", "desc"]).default("ASC"),
    "limit": z.coerce.number()
        .nonnegative({message: "limit debe ser mayor o igual a 0"}).default(100),
    "offset": z.coerce.number()
        .nonnegative({message: "offset debe ser mayor o igual a 0"}).default(0),
    "page": z.coerce.number().optional()
});

export const getByIDCategoriasSchema = z.object({
    "id_categoria": z.coerce
        .number()
        .int({message: "id_categoria debe ser un entero"})
});

export const updateCategoriasSchema = z.object({
    "descripcion": z.string({message: "descripcion debe ser un string"})
});

export const createCategoriasSchema = z.object({
    "descripcion": z.string({message: "Descripcion debe ser un string"}),
    "activo": z.number()
        .int()
        .min(-32,768)
        .max(32,767, {message: "activo debe ser un entero de 2 bytes"})
});