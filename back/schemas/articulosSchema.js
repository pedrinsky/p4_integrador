import z from 'zod';

const order = ["id_articulo", "id_area", "id_categoria", "descripcion", "activo"];

export const getAllArticulosSchema = z.object({
    "id_area": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_area debe ser un entero de 4 bytes"})
        .optional(),
    "id_categoria":z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_categoria debe ser un entero de 4 bytes"})
        .optional(),
    "descripcion": z.string({message: "Descripcion debe ser un string"})
        .optional(),
    "activo": z.coerce
        .number()
        .int()
        .min(-32,768)
        .max(32,767, {message: "activo debe ser un entero de 2 bytes"})
        .optional(),
    "order_column": z.enum(order, {message: "Valor invalido para el orden"}).default("id_articulo"),
    "direction": z.enum(["ASC", "asc", "DESC", "desc"], {message: "Valor no valido"}).default("ASC"),
    "limit": z.coerce
        .number()
        .int()
        .positive({message: "Limit debe ser un entero mayor a 0"}).default(100),
    "offset": z.coerce
        .number()
        .int()
        .nonnegative({message: "Offset debe ser un entero igual o mayor a 0"}).default(0),
    "page": z.coerce.number().optional()
});

export const getByIDArticulosSchema = z.object({
    "id_articulo": z.coerce
        .number()
        .int({message: "id_articulo debe ser un entero"})
});

export const updateArticulosSchema = z.object({
    "id_area": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_area debe ser un entero de 4 bytes"}).optional(),
    "id_categoria":z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_categoria debe ser un entero de 4 bytes"}).optional(),
    "descripcion": z.string({message: "Descripcion debe ser un string"})
        .optional(),
    "activo": z.coerce
        .number()
        .int()
        .min(-32,768)
        .max(32,767, {message: "activo debe ser un entero de 2 bytes"})
        .optional()
});


export const createArticulosSchema = z.object({
    "id_area": z.number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_area debe ser un entero de 4 bytes"}),
    "id_categoria":z.number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_categoria debe ser un entero de 4 bytes"}),
    "descripcion": z.string({message: "Descripcion debe ser un string"}),
    "activo": z.number()
        .int()
        .min(-32,768)
        .max(32,767, {message: "activo debe ser un entero de 2 bytes"})
});