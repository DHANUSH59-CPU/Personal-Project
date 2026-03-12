import { Router } from 'express';
import { register, login, logout, getMe, refreshToken, googleAuth } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleAuth);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/refresh', refreshToken);

export default router;
