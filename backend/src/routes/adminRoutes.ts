import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);

export default router;
