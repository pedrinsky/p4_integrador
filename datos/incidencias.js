export const incidencias = [
    {
        id_incidencia: 1,
        id_estado: 1, // 1 = Pendiente, 2 = En Proceso, 3 = Resuelta, 4 = Cancelada
        creado_por: 10, // ID del Empleado Municipal
        creado: "01-09-2026 08:30",
        prioridad: 3, // 3 = Alta, 2 = Media, 1 = Baja
        articulo: "101",
        articulo_descripcion: "PC de Escritorio - Oficina de Rentas",
        descripcion_pedido: "La computadora no enciende tras un corte de luz."
    },
    {
        id_incidencia: 2,
        id_estado: 3, // Resuelta
        creado_por: 10,
        creado: "31-08-2026 10:15",
        prioridad: 2,
        id_articulo: 102,
        articulo_descripcion: "Impresora HP Laserjet",
        descripcion_pedido: "Atasco constante de papel en la bandeja 2."
    }
];