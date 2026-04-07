import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import * as achievementsController from './achievements.controller';

const router = Router();

router.get('/', authMiddleware, achievementsController.listAll);
router.get('/mine', authMiddleware, achievementsController.getUserAchievements);

export default router;
