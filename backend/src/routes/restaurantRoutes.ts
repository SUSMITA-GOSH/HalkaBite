import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  getRestaurantOrders,
  getMyRestaurant,
  getRestaurantStats
} from '../controllers/restaurantController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getAllRestaurants);
router.get('/my-restaurant', protect, authorize('restaurant'), getMyRestaurant);
router.get('/:id', getRestaurant);
router.get('/:id/orders', protect, authorize('admin', 'restaurant'), getRestaurantOrders);
router.get('/:id/stats', protect, authorize('admin', 'restaurant'), getRestaurantStats);

// Admin only routes - restaurants cannot modify restaurant details
router.post('/', protect, authorize('admin'), createRestaurant);
router.put('/:id', protect, authorize('admin'), updateRestaurant);
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);
router.put('/:id/toggle', protect, authorize('admin'), toggleRestaurantStatus);

export default router;

