import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { adminMiddleware } from '../../middlewares/admin';
import * as adminController from './admin.controller';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/stats/donations-by-month', adminController.getDonationsByMonth);
router.get('/stats/blood-distribution', adminController.getBloodDistribution);
router.get('/stats/university-stats', adminController.getUniversityStats);
router.get('/stats/rank-distribution', adminController.getRankDistribution);
router.get('/export/users', adminController.exportUsers);
router.get('/export/donations', adminController.exportDonations);
router.get('/export/causes', adminController.exportCauses);

export default router;
