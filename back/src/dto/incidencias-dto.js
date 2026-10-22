export class IncidenciasResponseDTO {
    constructor(input) {
        this.id_incidencia = input.id_incidencia;
        this.id_articulo = input.id_articulo;
        this.id_estado = input.id_estado;
        this.creado_por = input.creado_por;
        this.asignado_a = input.asignado_a;
        this.prioridad = input.prioridad;
        this.descripcion_pedido = input.descripcion_pedido;
        this.descripcion_resolucion = input.descripcion_resolucion;
       
    }
}