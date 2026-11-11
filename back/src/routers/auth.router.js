import express from 'express';
import AuthController from '../controller/auth.controller.js';
import validateLogin from '../middleware/validateLogin.js';

const router = express.Router();
const authController = new AuthController();

router.post('/auth/login', validateLogin, authController.login);

export default router;