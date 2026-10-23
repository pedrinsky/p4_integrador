import { body, validationResult } from 'express-validator';

// Reglas de validación del login
const reglas = [
    body('usuario').isString().notEmpty(),
    body('contrasenia').isString().notEmpty(),
];

// Responde 400 si alguna regla falla
const handleErrors = (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'Solicitud incorrecta' });
    }
    next();
};

const validateLogin = [...reglas, handleErrors];

export default validateLogin;