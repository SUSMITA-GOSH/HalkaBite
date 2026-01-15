import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';
import { Order } from '../models/Order';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalRestaurants = await Restaurant.countDocuments({ isActive: true });
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } }, // Exclude cancelled orders
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Recent Activity (Last 5 orders)
        const recentActivity = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderNumber createdAt totalAmount orderStatus')
            .lean();

        // Popular Restaurants (Top 3 by revenue)
        const popularRestaurants = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: '$restaurant',
                    totalRevenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'restaurant'
                }
            },
            { $unwind: '$restaurant' },
            {
                $project: {
                    _id: 1,
                    name: '$restaurant.name',
                    image: '$restaurant.image',
                    totalRevenue: 1,
                    orderCount: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalRestaurants,
                totalOrders,
                totalRevenue,
                recentActivity,
                popularRestaurants
            }
        });
    } catch (error) {
        next(error);
    }
};
