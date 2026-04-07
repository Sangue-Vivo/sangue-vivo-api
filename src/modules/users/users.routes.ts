import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { updateProfileSchema } from './users.schemas';
import * as usersController from './users.controller';

const router = Router();

router.get('/profile', authMiddleware, usersController.getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), usersController.updateProfile);
router.get('/ranking', authMiddleware, usersController.getRanking);

export default router;
