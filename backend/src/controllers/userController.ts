import { Request, Response } from 'express';
import { User, Restaurant } from '../models';
import { ApiError } from '../utils/apiResponse';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

// @desc    Convert user to restaurant owner
// @route   PUT /api/users/:id/make-restaurant-owner
// @access  Private/Admin
export const convertToRestaurantOwner = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a restaurant owner
    if (user.role === 'restaurant') {
      return res.status(400).json({
        success: false,
        message: 'User is already a restaurant owner'
      });
    }

    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: userId });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'User already has a restaurant assigned'
      });
    }

    // Update user role
    user.role = 'restaurant';
    await user.save();

    // Create restaurant for the user
    const restaurant = await Restaurant.create({
      name: `${user.name}'s Restaurant`,
      description: 'Welcome to our restaurant! We serve delicious food with passion.',
      address: {
        street: '123 Main Street',
        city: 'Dhaka',
        state: 'Dhaka Division',
        zipCode: '1212',
        country: 'Bangladesh'
      },
      phone: user.phone || '01711223344',
      email: user.email,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
      cuisine: ['Bengali', 'Fast Food'],
      rating: 4.0,
      reviewCount: 0,
      deliveryTime: '30-45 min',
      deliveryFee: 50,
      minimumOrder: 100,
      isOpen: true,
      isActive: true,
      openingHours: [
        { day: 'Monday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Tuesday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Wednesday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Thursday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Saturday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Sunday', open: '10:00', close: '22:00', isClosed: false }
      ],
      owner: userId
    });

    res.status(200).json({
      success: true,
      message: 'User successfully converted to restaurant owner',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error converting user to restaurant owner'
    });
  }
};

