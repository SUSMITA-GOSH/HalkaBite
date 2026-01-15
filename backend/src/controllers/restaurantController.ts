import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Restaurant, FoodItem, Order } from '../models';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const { search, cuisine, city, isOpen, sort, page = 1, limit = 12 } = req.query;

    const query: any = { isActive: true };

    if (cuisine) query.cuisine = { $in: (cuisine as string).split(',') };
    if (city) query['address.city'] = new RegExp(city as string, 'i');
    if (isOpen === 'true') query.isOpen = true;

    if (search) {
      query.$text = { $search: search as string };
    }

    let sortOption: any = { rating: -1 };
    if (sort === 'deliveryTime') sortOption = { deliveryTime: 1 };
    if (sort === 'deliveryFee') sortOption = { deliveryFee: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [restaurants, total] = await Promise.all([
      Restaurant.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Restaurant.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        restaurants,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single restaurant with menu
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get menu items
    const menuItems = await FoodItem.find({
      restaurant: req.params.id,
      isAvailable: true
    }).populate('category', 'name');

    // Group by category
    const menuByCategory = menuItems.reduce((acc: any, item) => {
      const categoryName = (item.category as any)?.name || 'Other';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        menu: menuByCategory
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
export const createRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Also delete all food items
    await FoodItem.deleteMany({ restaurant: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Toggle restaurant open/close
// @route   PUT /api/restaurants/:id/toggle
// @access  Private/Admin
export const toggleRestaurantStatus = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: `Restaurant is now ${restaurant.isOpen ? 'open' : 'closed'}`,
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get my restaurant (for restaurant owners)
// @route   GET /api/restaurants/my-restaurant
// @access  Private/Restaurant Owner
export const getMyRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    // Find restaurant owned by current user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'No restaurant found for this account'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get orders for a specific restaurant
// @route   GET /api/restaurants/:id/orders
// @access  Private/Restaurant Owner
export const getRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const { status, page = 1, limit = 20 } = req.query;

    const query: any = { restaurant: restaurantId };
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .populate('items.foodItem', 'name image price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get restaurant statistics
// @route   GET /api/restaurants/:id/stats
// @access  Private/Restaurant Owner
export const getRestaurantStats = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Order.aggregate([
      {
        $match: {
          restaurant: new mongoose.Types.ObjectId(restaurantId),
          orderStatus: { $nin: ['pending', 'cancelled'] } // Exclude pending and cancelled
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          todayRevenue: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', today] }, '$totalAmount', 0]
            }
          },
          todayOrders: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', today] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get pending orders count separately
    const pendingCount = await Order.countDocuments({
      restaurant: restaurantId,
      orderStatus: 'pending'
    });

    const defaultStats = {
      totalRevenue: 0,
      totalOrders: 0,
      todayRevenue: 0,
      todayOrders: 0,
      pendingOrders: pendingCount
    };

    res.status(200).json({
      success: true,
      data: stats.length > 0 ? { ...stats[0], pendingOrders: pendingCount } : defaultStats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

