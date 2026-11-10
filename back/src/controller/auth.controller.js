import jwt from "jsonwebtoken";

export class AuthController {
    constructor({usersService}){
        this.usersService = usersService;
    }

    login = async (req, res) => {
        try {
            console.log("Controller");
            const { usuario, contrasenia } = req.body;
            const resultado = await this.usersService.login({ usuario, contrasenia });
            if (!resultado) {
                return res.status(400).json({ message: 'Nombre de usuario y/o contraseña incorrectos.' });
            }
            // Crear el token JWT
            const token = jwt.sign(
                { id_usuario: resultado.id_usuario },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 1000 * 60 * 60
            }).send(resultado);
        } catch (exc) {
            console.error(exc);
            return res.status(400).json({ message: exc.message || 'Error interno' });
        }
    };

    logout = async (req, res) => {
        res
        .clearCookie('access_token')
        .json({message: "Logout exitoso"});
    };

}