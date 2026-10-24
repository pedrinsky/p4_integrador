export class AuthController {
    constructor({usersService}){
        this.usersService = usersService;
    }

    login = async (req, res) => {
        try {
            const { usuario, contrasenia } = req.body;
            const resultado = await this.usersService.login(usuario, contrasenia);
            return res.json(resultado);
        } catch (exc) {
            console.error(exc);
            return res.status(400).json({ message: exc.message || 'Error interno' });
        }
    };

}