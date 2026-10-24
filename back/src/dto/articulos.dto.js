export class ArticulosResponseDTO{
    constructor(input){
        this.id_articulo = input.id_articulo;
        this.id_area = input.id_area;
        this.id_categoria = input.id_categoria;
        this.descripcion = input.descripcion;
        this.activo = input.activo;
    }
}