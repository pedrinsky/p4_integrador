export class ArticulosResponseDTO{
    constructor(input){
        this.id_articulo = input.id_articulo;
        this.area = input.area || input.descripcion_area || 'Desconocida';
        this.categoria = input.categoria || input.descripcion_categoria || 'Desconocida';
        this.descripcion = input.descripcion || '';
        this.activo = input.activo !== undefined && input.activo !== null ? Number(input.activo) : 1;
    }
}