import React from 'react';
import { motion } from 'framer-motion';
import { Users, Store, ShoppingBag, DollarSign } from 'lucide-react';
import { useGetAdminStatsQuery } from '../../store/api/adminApi';

const AdminDashboardPage: React.FC = () => {
    const { data: statsData, isLoading } = useGetAdminStatsQuery();
    const stats = statsData?.data;

    if (isLoading) {
        return <div className="text-center py-8">Loading dashboard stats...</div>;
    }

    if (!stats) {
        return <div className="text-center py-8 text-red-500">Failed to load dashboard stats</div>;
    }

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
        { label: 'Total Restaurants', value: stats.totalRestaurants, icon: Store, color: 'from-purple-500 to-pink-500' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'from-orange-500 to-yellow-500' },
        { label: 'Total Revenue', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-white/60 text-sm">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((order) => (
                                <div key={order._id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    <div>
                                        <div className="text-sm font-medium">New order #{order.orderNumber} received</div>
                                        <div className="text-xs text-white/40">
                                            {new Date(order.createdAt).toLocaleString()} • ৳{order.totalAmount}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-white/40 text-sm">No recent activity</div>
                        )}
                    </div>
                </div>

                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Popular Restaurants</h2>
                    <div className="space-y-4">
                        {stats.popularRestaurants.length > 0 ? (
                            stats.popularRestaurants.map((restaurant) => (
                                <div key={restaurant._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={restaurant.image || 'https://via.placeholder.com/100'}
                                            alt={restaurant.name}
                                            className="w-10 h-10 rounded-lg object-cover bg-white/10"
                                        />
                                        <div>
                                            <div className="text-sm font-medium">{restaurant.name}</div>
                                            <div className="text-xs text-white/40">{restaurant.orderCount} orders</div>
                                        </div>
                                    </div>
                                    <div className="text-green-400 font-bold">৳{restaurant.totalRevenue.toLocaleString()}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-white/40 text-sm">No data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
