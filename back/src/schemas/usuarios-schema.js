import z from 'zod';

// 1. Esquema Base con todos los campos de la tabla usuarios
export const BaseUsuariosSchema = z.object({
    id_usuario: z.coerce
        .number()
        .int()
        .min(1, { message: "El id_usuario debe ser un entero positivo" }),
    nombre: z
        .string({ required_error: "El nombre es obligatorio" })
        .min(1, { message: "El nombre no puede estar vacío" }),
    apellido: z
        .string({ required_error: "El apellido es obligatorio" })
        .min(1, { message: "El apellido no puede estar vacío" }),
    nombre_usuario: z
        .string({ required_error: "El nombre de usuario es obligatorio" })
        .min(4, { message: "El nombre de usuario debe tener al menos 4 caracteres" }),
    contrasenia: z
        .string({ required_error: "La contraseña es obligatoria" })
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    activo: z.coerce
        .number()
        .int()
        .min(0)
        .max(1)
        .optional()
});

//Esquema para validación de URL
export const getByIDUsuariosSchema = z.object({
    id: BaseUsuariosSchema.shape.id_usuario
});

export const createUsuariosSchema = BaseUsuariosSchema.pick({
    "nombre": true,
    "apellido": true,
    "nombre_usuario": true,
    "contrasenia": true,
    "activo": true
});

export const updateUsuariosSchema = BaseUsuariosSchema.partial()
    .pick({
        "nombre": true,
        "apellido": true,
        "nombre_usuario": true,
        "contrasenia": true,
        "activo": true
    })
    .refine((data) => {
        return Object.values(data).length > 0
    }, { message: "Se debe rellenar al menos un campo a cambiar" });
    
// 5. Esquema para el Login - Solo exige las credenciales exactas
export const loginUsuariosSchema = z.object({
    nombre_usuario: BaseUsuariosSchema.shape.nombre_usuario,
    contrasenia: BaseUsuariosSchema.shape.contrasenia
});