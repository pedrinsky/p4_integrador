import z from 'zod';

const order = ["id_articulo", "id_area", "id_categoria", "descripcion", "activo"];
const direction = ["asc", "desc"];

export const BaseArticulosSchema = z.object({
    "id_articulo": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_articulo debe ser un entero de 4 bytes"}),
    "id_area": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_area debe ser un entero de 4 bytes"}),
    "id_categoria":z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_categoria debe ser un entero de 4 bytes"}),
    "descripcion": z.string({message: "Descripcion debe ser un string"})
        .max(250),
    "activo": z.coerce
        .number()
        .int()
        .min(-32,768)
        .max(32,767, {message: "activo debe ser un entero de 2 bytes"}),
    "order_column": z.enum(order, {message: "Valor invalido para el orden"}),
    "direction": z.preprocess(
        val => typeof val === "string" 
            ? val.toLowerCase() 
            : val
        , z.enum(direction, {message: "Valor no valido"})
    )
        ,
    "limit": z.coerce
        .number()
        .int()
        .positive({message: "Limit debe ser un entero mayor a 0"}),
    "offset": z.coerce
        .number()
        .int()
        .nonnegative({message: "Offset debe ser un entero igual o mayor a 0"})
});


export const getAllArticulosSchema = BaseArticulosSchema.exactPartial({
    "id_articulo": true,
    "id_area": true,
    "id_categoria": true,
    "descripcion": true,
    "activo": true
})


export const getByIDArticulosSchema = BaseArticulosSchema.pick({ "id_articulo": true });

export const updateArticulosSchema = BaseArticulosSchema
    .partial()
    .pick({
        "id_area": true,
        "id_categoria": true,
        "descripcion": true,
        "activo": true})
    .refine((data) => {
    return Object.values(data).length > 0
    }
    , {message: "Se debe rellenar al menos un campo a cambiar"}
    );

export const createArticulosSchema = BaseArticulosSchema.pick({
        "id_area": true,
        "id_categoria": true,
        "descripcion": true,
        "activo": true
    });