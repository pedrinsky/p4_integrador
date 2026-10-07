import z from 'zod';

const order = ["id_incidencia", "id_articulo", "id_estado", "creado_por", "asignado_a"
    , "creado", "prioridad", "descripcion_pedido", "descripcion_resolucion" ];
    

export const getAllIncidenciasSchema = z.object({
    "id_incidencia": z.coerce
        .number()
        .int()
        .optional(),
    "id_articulo": z.coerce
        .number()
        .int()
        .optional(),
    "id_estado": z.coerce
        .number()
        .int()
        .optional(),
    "creado_por": z.coerce
        .number()
        .int()
        .optional(),
    "asignado_a": z.coerce
        .number()
        .int()
        .optional(),
    "creado": z.iso.date({message: "creado debe ser una fecha valida"})
        .optional(),
    "prioridad": z.coerce
        .number()
        .int()
        .optional(),
    "descripcion_pedido": z.string({message: "descripcion_pedido debe ser un string"})
        .optional(),
    "descripcion_resolucion": z.string({message: "descripcion_pedido debe ser un string"})
        .optional(),
    "order_column": z.enum(order, {message: "Valor invalido para el orden"}).default("id_incidencia"),
    "direction": z.enum(["ASC", "asc", "DESC", "desc"], {message: "Valor no valido"}).default("ASC"),
    "limit": z.coerce
        .number()
        .int()
        .positive({message: "Limit debe ser un entero mayor a 0"}).default(100),
    "offset": z.coerce
        .number()
        .int()
        .nonnegative({message: "Offset debe ser un entero igual o mayor a 0"}).default(0),
    "page": z.coerce.number().optional(),
    "estado": z.coerce.number().optional(),
    "exclude_estado": z.coerce.number().optional(),
    "search": z.string().optional()
});

export const getByIDIncidenciasSchema = z.object({
    "id_incidencia": z.coerce
        .number()
        .int({message: "id_incidencia debe ser un entero"})
});

export const updateIncidenciasSchema = z.object({
    "id_articulo": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .optional(),
    "id_estado": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .optional(),
    "creado_por": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .optional(),
    "asignado_a": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .optional(),
    "creado": z.iso.date({message: "creado debe ser una fecha valida"})
        .optional(),
    "prioridad": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .optional(),
    "descripcion_pedido": z.string({message: "descripcion_pedido debe ser un string"})
        .optional(),
    "descripcion_resolucion": z.string({message: "descripcion_pedido debe ser un string"})
        .optional()
});

export const createIncidenciasSchema = z.object({
    "id_articulo": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647).optional().nullable(),
    "creado_por": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647).optional().default(1),
    "asignado_a": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647).optional().nullable(),
    "prioridad": z.coerce
        .number()
        .int()
        .min(-2147483648)
        .max(2147483647).default(1),
    "descripcion_pedido": z.string({message: "descripcion_pedido debe ser un string"}).max(250)
});