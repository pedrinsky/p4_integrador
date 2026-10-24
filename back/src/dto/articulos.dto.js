export class ArticulosResponseDTO{
    constructor(input){
        this.id_articulo = input.id_articulo;
        this.area = input.area;
        this.categoria = input.categoria;
        this.descripcion = input.descripcion;
        this.activo = input.activo;
    }
}