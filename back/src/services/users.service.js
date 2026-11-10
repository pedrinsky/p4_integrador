import crypto from 'crypto';
import User from "../repository/users.repository.js";
import jwt from 'jsonwebtoken';
import { UsuariosResponseDTO } from '../dto/usuarios.dto.js';

export class UsersService {

    // Función auxiliar estática para borrar la contraseña antes de responder
    static removeContrasenia(usuarioOLista) {
        // Si es una lista aplico map
        if (Array.isArray(usuarioOLista)) {
            return usuarioOLista.map(u => {
                const { contrasenia, ...resto } = u;
                return resto;
            });
        }
        // Si es un solo objeto separao la contraseña
        if (usuarioOLista) {
            const { contrasenia, ...resto } = usuarioOLista;
            return resto;
        }
        return null;
    }

    static async getAll(input) {
        console.log("Service");
        const usuarios = await User.getAll(input); 
        // return this.removeContrasenia(usuarios);
        // const result = await this.removeContrasenia(usuarios);
        return result.map(usuario => new UsuariosResponseDTO(usuario));
    }

    static async getById(id) {
        console.log("Service");
        const usuario = await User.getByID(id);
        // return this.removeContrasenia(usuario);
        const result = await this.removeContrasenia(usuario);
        return new UsuariosResponseDTO(result);
    }

    static async create(datos) {
        const contraseniaHash = crypto.createHash('sha256').update(datos.contrasenia).digest('hex');

        const usuario_nuevo = {
            apellido: datos.apellido,
            nombre: datos.nombre,
            nombre_usuario: datos.nombre_usuario,
            contrasenia: contraseniaHash,
            activo: datos.activo !== undefined ? datos.activo : 1
        };

        const usuarioCreado = await User.create(usuario_nuevo);
        // return this.removeContrasenia(usuarioCreado);
        const result = await this.removeContrasenia(usuarioCreado);
        return new UsuariosResponseDTO(result);
    }

    static async update(id, datos) {
        const usuario_nuevo = {
            apellido: datos.apellido,
            nombre: datos.nombre,
            nombre_usuario: datos.nombre_usuario,
            activo: datos.activo !== undefined ? datos.activo : 1
        };

        if (datos.contrasenia && datos.contrasenia.trim() !== '') {
            usuario_nuevo.contrasenia = crypto.createHash('sha256').update(datos.contrasenia).digest('hex');
        }

        const usuarioActualizado = await User.update(id, usuario_nuevo);
        // return this.removeContrasenia(usuarioActualizado);
        const result = await this.removeContrasenia(usuarioActualizado);
        return new UsuariosResponseDTO(result)
    }

    static async delete(input) {
        return this.remove(input);
    }
    //Entradas: usuario, contrasenia
    //Salidas: token, refresh_token, datos_usuario_noContrasenia
    //Crear DTO para formatear datos del usuario
    static async login(input) {
        // Buscar el usuario
        const { usuario, contrasenia } = input;
        const usuario_log = await User.findByUsernamePassword({ usuario, contrasenia });
        if (!usuario_log || usuario_log.length === 0) {
            return undefined;
        }

        return usuario_log;

        // // Crear el token JWT
        // const token = jwt.sign(
        //     { 
        //         id_usuario: usuario_log.id_usuario, 
        //         usuario: usuario_log.usuario, 
        //         nombre_usuario: usuario_log.usuario,
        //         rol: usuario_log.rol 
        //     },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '2h' }
        // );

        // return {
        //     token,
        //     // Reutilizo la función auxiliar para limpiar los datos del usuario en el login
        //     usuario: this.removeContrasenia(usuario_log) 
        // };
    }
}