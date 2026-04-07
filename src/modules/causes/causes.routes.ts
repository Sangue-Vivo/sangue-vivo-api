import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { adminMiddleware } from '../../middlewares/admin';
import { validate } from '../../middlewares/validate';
import { createCauseSchema, updateCauseSchema } from './causes.schemas';
import * as causesController from './causes.controller';

const router = Router();

router.get('/', authMiddleware, causesController.list);
router.get('/compatible', authMiddleware, causesController.getCompatible);
router.get('/:id', authMiddleware, causesController.getById);
router.post('/', authMiddleware, adminMiddleware, validate(createCauseSchema), causesController.create);
router.put('/:id', authMiddleware, adminMiddleware, validate(updateCauseSchema), causesController.update);
router.patch('/:id/status', authMiddleware, adminMiddleware, causesController.updateStatus);
router.delete('/:id', authMiddleware, adminMiddleware, causesController.remove);

export default router;
