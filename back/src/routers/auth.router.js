import express from 'express';
import { UsersService } from '../services/users.service.js';
import { AuthController } from '../controller/auth.controller.js';
import validateLogin from '../middleware/validateLogin.js';

const router = express.Router();
const authController = new AuthController({ usersService: UsersService });

router.post('/auth/login', validateLogin, authController.login);

export default router;