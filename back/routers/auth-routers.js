import express from 'express';
import AuthController from '../src/controller/auth-controllers.js';
import validateLogin from '../src/middleware/validateLogin.js';

const router = express.Router();
const authController = new AuthController();

router.post('/auth/login', validateLogin, authController.login);

export default router;