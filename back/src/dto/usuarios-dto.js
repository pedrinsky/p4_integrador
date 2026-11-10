export class UsuariosResponseDTO {
    constructor(input) {
        this.id_usuario = input.id_usuario;
        this.apellidos = input.apellidos;
        this.nombres = input.nombres;
        this.usuario = input.usuario;
        this.email = input.email;
        this.avatar = input?.avatar || "";
        this.rol = input.rol;
    }
}