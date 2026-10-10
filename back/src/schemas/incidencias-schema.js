import z from 'zod';

const order = ["id_incidencia", "id_articulo", "id_estado", "creado_por", "asignado_a"
    , "creado", "prioridad", "descripcion_pedido", "descripcion_resolucion" ];

const direction = ["asc", "desc"];
    

export const BaseIncidenciasSchema = z.object({
    "id_incidencia": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_incidencia debe ser un entero de 4 bytes"}),
    "id_articulo": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_articulo debe ser un entero de 4 bytes"}),
    "id_estado": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "id_estado debe ser un entero de 4 bytes"}),
    "creado_por": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "creado_por debe ser un entero de 4 bytes"}),
    "asignado_a": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "asignado_a debe ser un entero de 4 bytes"}),
    "creado": z.iso.date({message: "creado debe ser una fecha valida"}),
    "prioridad": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647, {message: "prioridad debe ser un entero de 4 bytes"}),
    "descripcion_pedido": z.string({message: "descripcion_pedido debe ser un string"})
        .max(250),
    "descripcion_resolucion": z.string({message: "descripcion_pedido debe ser un string"})
        .max(250),
    "order_column": z.enum(order, {message: "Valor invalido para el orden"}),
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


export const getAllIncidenciasSchema = BaseIncidenciasSchema.partial({
    "id_incidencia": true,
    "id_articulo": true,
    "id_estado": true,
    "creado_por": true,
    "asignado_a": true,
    "creado": true,
    "prioridad": true,
    "descripcion_pedido": true,
    "descripcion_resolucion": true
})


export const getByIDIncidenciasSchema = BaseIncidenciasSchema.pick({ "id_incidencia": true });


export const updateIncidenciasSchema = BaseIncidenciasSchema.partial()
    .pick({
        "id_articulo": true,
        "id_estado": true,
        "creado_por": true,
        "asignado_a": true,
        "creado": true,
        "prioridad": true,
        "descripcion_pedido": true,
        "descripcion_resolucion": true
    })
    .refine((data) => {
        return Object.values(data).length > 0
        }
        , {message: "Se debe rellenar al menos un campo a cambiar"}
    );


export const createIncidenciasSchema = BaseIncidenciasSchema.pick({
    "id_articulo": true,
    "creado_por": true,
    "asignado_a": true,
    "prioridad": true,
    "descripcion_pedido": true,
});
