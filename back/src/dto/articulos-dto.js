export class ArticulosResponseDTO{
    constructor(input){
        this.id_articulo = input.id_articulo;
        this.idArticulo = input.id_articulo;
        this.id_area = input.id_area;
        this.area = input.area;
        this.id_categoria = input.id_categoria;
        this.categoria = input.categoria;
        this.descripcion = input.descripcion;
        this.activo = input.activo;
    }
}