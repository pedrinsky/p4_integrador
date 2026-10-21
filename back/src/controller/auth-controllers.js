import { UsersService } from '../services/users-services.js';

class AuthController {

    login = async (req, res) => {
        try {
            const { usuario, contrasenia } = req.body;
            const resultado = await UsersService.login(usuario, contrasenia);
            return res.json(resultado);
        } catch (exc) {
            console.error(exc);
            return res.status(400).json({ message: exc.message || 'Error interno' });
        }
    };

}

export default AuthController;