import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { adminMiddleware } from '../../middlewares/admin';
import { validate } from '../../middlewares/validate';
import { scheduleDonationSchema } from './donations.schemas';
import * as donationsController from './donations.controller';

const router = Router();

router.post('/', authMiddleware, validate(scheduleDonationSchema), donationsController.schedule);
router.get('/', authMiddleware, donationsController.list);
router.get('/:id', authMiddleware, donationsController.getById);
router.patch('/:id/cancel', authMiddleware, donationsController.cancel);
router.patch('/:id/complete', authMiddleware, adminMiddleware, donationsController.complete);
router.patch('/:id/no-show', authMiddleware, adminMiddleware, donationsController.noShow);

export default router;
