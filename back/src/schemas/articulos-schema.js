import z from 'zod';

const order = ["id_articulo", "id_area", "id_categoria", "descripcion", "activo"];

export const getAllArticulosSchema = z.object({
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
        .optional(),
    "order_column": z.enum(order, {message: "Valor invalido para el orden"}),
    "asc": z.coerce
    .boolean({message: "Direction debe ser un booleano"}),
    "limit": z.coerce
        .number()
        .int()
        .positive({message: "Limit debe ser un entero mayor a 0"}),
    "offset": z.coerce
        .number()
        .int()
        .nonnegative({message: "Offset debe ser un entero igual o mayor a 0"})
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

export const patchArticulosSchema = z.object({
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