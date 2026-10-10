import z from 'zod';

const order = ["id_categoria", "descripcion", "activo"];
const direction = ["asc", "desc"];

export const BaseCategoriasSchema = z.object({
    "id_categoria": z.coerce
        .number()
        .int({message: "id_categoria debe ser un entero"})
        .min(-2147483648)
        .max(2147483647, {message: "id_categoria debe ser un entero de 4 bytes"}),
    "descripcion": z.string({message: "descripcion debe ser un string"})
        .max(250),
    "activo": z.coerce.number()
        .int({message: "activo debe ser un entero"})
        .min(-32,768)
        .max(32,767, {message: "activo debe ser un entero de 2 bytes"}),
    "order_column": z.enum(order, {message: "Valor invalido para order_column"}),
    "direction": z.preprocess(
            val => typeof val === "string" 
                ? val.toLowerCase() 
                : val
            , z.enum(direction, {message: "Valor no valido"})
        ),
    "limit": z.coerce
            .number()
            .int()
            .positive({message: "Limit debe ser un entero mayor a 0"}),
    "offset": z.coerce
        .number()
        .int()
        .nonnegative({message: "Offset debe ser un entero igual o mayor a 0"})
});

export const getAllCategoriasSchema = BaseCategoriasSchema.partial({
    "id_categoria": true,
    "descripcion": true,
    "activo": true
})

export const getByIDCategoriasSchema = BaseCategoriasSchema.pick({"id_categoria": true});

export const updateCategoriasSchema = BaseCategoriasSchema.partial()
    .pick({ "descripcion": true })
    .refine((data) => {
        return Object.values(data).length > 0
        }
        , {message: "Se debe rellenar al menos un campo a cambiar"}
    );

export const createCategoriasSchema = BaseCategoriasSchema.pick({
    "descripcion": true,
    "activo": true
})
