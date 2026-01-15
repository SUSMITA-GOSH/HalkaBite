import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  reorder
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect); // All order routes require auth

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.post('/:id/reorder', reorder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin', 'restaurant'), updateOrderStatus);

export default router;
