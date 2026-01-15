import { Router } from 'express';
import {
  getAllFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getFoodByCategory
} from '../controllers/foodController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getAllFoodItems);
router.get('/category/:slug', getFoodByCategory);
router.get('/:id', getFoodItem);

// Restaurant owners only - can add, update, and delete their items
router.post('/', protect, authorize('restaurant'), createFoodItem);
router.put('/:id', protect, authorize('restaurant'), updateFoodItem);
router.delete('/:id', protect, authorize('admin', 'restaurant'), deleteFoodItem);

export default router;
