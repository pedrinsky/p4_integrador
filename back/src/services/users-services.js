import crypto from 'crypto';
import User from "../repository/users-repository.js";
import jwt from 'jsonwebtoken';

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

    static async getAll() {
        const usuarios = await User.findAll(); 
        return this.removeContrasenia(usuarios);
    }

    static async getById(id) {
        const usuario = await User.getById(id);
        return this.removeContrasenia(usuario);
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
        return this.removeContrasenia(usuarioCreado);
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
        return this.removeContrasenia(usuarioActualizado);
    }

    static async getByID(input) {
        return this.getById(input);
    }

    static async delete(input) {
        return this.remove(input);
    }

    static async login(nombre_usuario, contrasenia) {
        // Buscar el usuario
        const usuarios = await User.getByUsername(nombre_usuario);
        if (!usuarios || usuarios.length === 0) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        const usuario = usuarios[0];

        // Comparar el hash de la contraseña recibida
        const contraseniaHash = crypto.createHash('sha256').update(contrasenia).digest('hex');
        if (usuario.contrasenia !== contraseniaHash) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // Crear el token JWT
        const token = jwt.sign(
            { 
                id_usuario: usuario.id_usuario, 
                usuario: usuario.usuario, 
                nombre_usuario: usuario.usuario,
                rol: usuario.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return {
            token,
            // Reutilizo la función auxiliar para limpiar los datos del usuario en el login
            usuario: this.removeContrasenia(usuario) 
        };
    }
}