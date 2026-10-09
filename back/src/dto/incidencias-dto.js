export class  IncidenciasResponseDTO{
    constructor(input){
        this.idIncidencia = input.id_incidencia;
        this.articulo = input.articulo;
        this.estado = input.estado;
        this.creadoPor = input.creado_por;
        this.signadoA = input.asignado_a;
        this.creado = input.creado;
        this.prioridad = input.prioridad;
        this.descripcionPedido = input.descripcion_pedido;
        this.descripcionResolucion = input.descripcion_resolucion;
    }
}