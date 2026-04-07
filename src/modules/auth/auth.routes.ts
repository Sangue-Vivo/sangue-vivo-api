import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { authMiddleware } from '../../middlewares/auth';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schemas';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;
