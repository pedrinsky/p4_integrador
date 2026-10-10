export class ArticulosResponseDTO{
    constructor(input){
        this.idArticulo = input.id_articulo;
        this.area = input.area;
        this.categoria = input.categoria;
        this.descripcion = input.descripcion;
    }
}