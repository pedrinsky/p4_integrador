import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Gestión de Incidencias Municipales',
            version: '1.0.0',
            description: 'Documentación oficial de los servicios RESTful para el Trabajo Final Integrador (Programación IV - UNER). Permite la gestión de incidencias, artículos, categorías y autenticación por roles (Empleado Municipal, Empleado de Sistemas y Director).'
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Servidor Local de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingrese el token JWT obtenido tras iniciar sesión en /api/login.'
                }
            },
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['usuario', 'contrasenia'],
                    properties: {
                        usuario: { type: 'string', example: 'pamalm@correo.com' },
                        contrasenia: { type: 'string', example: 'director123' }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        usuario: {
                            type: 'object',
                            properties: {
                                id_usuario: { type: 'integer', example: 3 },
                                nombres: { type: 'string', example: 'Pamela' },
                                apellidos: { type: 'string', example: 'Almeida' },
                                usuario: { type: 'string', example: 'pamalm@correo.com' },
                                rol: { type: 'integer', example: 1 }
                            }
                        }
                    }
                },
                IncidenciaCreate: {
                    type: 'object',
                    required: ['descripcion_pedido'],
                    properties: {
                        descripcion_pedido: { type: 'string', example: 'No enciende la pantalla de la PC' },
                        prioridad: { type: 'integer', enum: [1, 2, 3], example: 2 },
                        id_articulo: { type: 'integer', nullable: true, example: 3 }
                    }
                },
                IncidenciaResponse: {
                    type: 'object',
                    properties: {
                        id_incidencia: { type: 'integer', example: 1 },
                        id_articulo: { type: 'integer', nullable: true, example: 3 },
                        articulo: { type: 'string', example: 'Notebook HP' },
                        id_estado: { type: 'integer', example: 1 },
                        estado: { type: 'string', example: 'Pendiente' },
                        creado_por: { type: 'string', example: 'carper@correo.com' },
                        asignado_a: { type: 'string', nullable: true, example: 'estren@correo.com' },
                        creado: { type: 'string', format: 'date-time' },
                        prioridad: { type: 'integer', example: 2 },
                        descripcion_pedido: { type: 'string' },
                        descripcion_resolucion: { type: 'string', nullable: true }
                    }
                },
                Articulo: {
                    type: 'object',
                    properties: {
                        id_articulo: { type: 'integer', example: 1 },
                        id_area: { type: 'integer', example: 1 },
                        area: { type: 'string', example: 'Legales' },
                        id_categoria: { type: 'integer', example: 2 },
                        categoria: { type: 'string', example: 'Perifericos' },
                        descripcion: { type: 'string', example: 'Monitor LG' },
                        activo: { type: 'integer', example: 1 }
                    }
                },
                Categoria: {
                    type: 'object',
                    properties: {
                        id_categoria: { type: 'integer', example: 1 },
                        descripcion: { type: 'string', example: 'Equipos de Red' },
                        activo: { type: 'integer', example: 1 }
                    }
                }
            }
        },
        paths: {
            '/login': {
                post: {
                    tags: ['Autenticación'],
                    summary: 'Iniciar sesión y obtener token JWT',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Autenticación exitosa',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/LoginResponse' }
                                }
                            }
                        },
                        400: { description: 'Credenciales inválidas o datos faltantes' }
                    }
                }
            },
            '/incidencias': {
                get: {
                    tags: ['Incidencias'],
                    summary: 'Listar incidencias paginadas (con filtrado automático por rol)',
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 5 } },
                        { name: 'search', in: 'query', schema: { type: 'string' } },
                        { name: 'estado', in: 'query', schema: { type: 'integer' } },
                        { name: 'prioridad', in: 'query', schema: { type: 'integer' } },
                        { name: 'exclude_estado', in: 'query', schema: { type: 'integer' } }
                    ],
                    responses: {
                        200: {
                            description: 'Listado de incidencias y metadatos de paginación',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            incidencias: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/IncidenciaResponse' }
                                            },
                                            paginacion: {
                                                type: 'object',
                                                properties: {
                                                    totalPaginas: { type: 'integer' },
                                                    paginaActual: { type: 'integer' },
                                                    totalRegistros: { type: 'integer' },
                                                    limitePorPagina: { type: 'integer' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: { description: 'Token no provisto o expirado' }
                    }
                },
                post: {
                    tags: ['Incidencias'],
                    summary: 'Crear una nueva incidencia (artículo opcional)',
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/IncidenciaCreate' }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Incidencia creada con éxito' },
                        400: { description: 'Error de validación en los datos' },
                        401: { description: 'No autenticado' }
                    }
                }
            },
            '/incidencias/dashboard/metrics': {
                get: {
                    tags: ['Incidencias'],
                    summary: 'Obtener métricas consolidadas del dashboard (totales por estado, prioritarias y fechas)',
                    security: [{ BearerAuth: [] }],
                    responses: {
                        200: { description: 'Métricas para el dashboard del director' },
                        401: { description: 'No autenticado' }
                    }
                }
            },
            '/incidencias/{id_incidencia}': {
                get: {
                    tags: ['Incidencias'],
                    summary: 'Obtener el detalle de una incidencia por ID',
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { name: 'id_incidencia', in: 'path', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        200: { description: 'Detalle de la incidencia' },
                        404: { description: 'Incidencia no encontrada' }
                    }
                },
                patch: {
                    tags: ['Incidencias'],
                    summary: 'Actualizar o asignar una incidencia (Director)',
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { name: 'id_incidencia', in: 'path', required: true, schema: { type: 'integer' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        asignado_a: { type: 'integer', example: 4 },
                                        id_estado: { type: 'integer', example: 2 }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Incidencia actualizada con éxito' },
                        400: { description: 'No se puede modificar una incidencia cancelada' }
                    }
                },
                delete: {
                    tags: ['Incidencias'],
                    summary: 'Cancelar una incidencia (soft-delete a estado 4 Cancelada)',
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { name: 'id_incidencia', in: 'path', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        200: { description: 'Incidencia cancelada con éxito' }
                    }
                }
            },
            '/incidencias/{id_incidencia}/finalizar': {
                put: {
                    tags: ['Incidencias'],
                    summary: 'Finalizar una incidencia asignada (Empleado de Sistemas)',
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { name: 'id_incidencia', in: 'path', required: true, schema: { type: 'integer' } }
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        descripcion_resolucion: { type: 'string', example: 'Se cambió el cable de alimentación.' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Incidencia finalizada con éxito' }
                    }
                }
            },
            '/articulos': {
                get: {
                    tags: ['Artículos'],
                    summary: 'Listar artículos (con paginación y filtro de activos)',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer' } },
                        { name: 'limit', in: 'query', schema: { type: 'integer' } },
                        { name: 'activo', in: 'query', schema: { type: 'integer', enum: [0, 1] } }
                    ],
                    responses: {
                        200: { description: 'Listado de artículos' }
                    }
                },
                post: {
                    tags: ['Artículos'],
                    summary: 'Crear un nuevo artículo (Empleado de Sistemas)',
                    responses: {
                        200: { description: 'Artículo creado' }
                    }
                }
            },
            '/categorias': {
                get: {
                    tags: ['Categorías'],
                    summary: 'Listar categorías (con paginación y filtro de activas)',
                    responses: {
                        200: { description: 'Listado de categorías' }
                    }
                },
                post: {
                    tags: ['Categorías'],
                    summary: 'Crear una nueva categoría (Empleado de Sistemas)',
                    responses: {
                        200: { description: 'Categoría creada' }
                    }
                }
            },
            '/usuarios/sistemas': {
                get: {
                    tags: ['Usuarios'],
                    summary: 'Listar personal técnico del área de sistemas (rol 3) para asignaciones',
                    responses: {
                        200: { description: 'Lista de técnicos disponibles' }
                    }
                }
            }
        }
    },
    apis: []
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
export { swaggerUi };

