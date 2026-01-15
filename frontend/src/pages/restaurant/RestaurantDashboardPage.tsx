import React from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, TrendingUp, Clock, ChefHat, ShoppingCart } from 'lucide-react';
import { useGetMyRestaurantQuery, useGetRestaurantOrdersQuery, useGetRestaurantStatsQuery } from '../../store/api/restaurantApi';

const RestaurantDashboardPage: React.FC = () => {
    // Get the restaurant owned by current user
    const { data: restaurantData, isLoading: restaurantLoading, error: restaurantError } = useGetMyRestaurantQuery();
    const restaurant = restaurantData?.data;
    const restaurantId = restaurant?._id;

    // Get orders for this restaurant (for recent orders list)
    const { data: ordersData } = useGetRestaurantOrdersQuery(
        { id: restaurantId!, status: 'all', limit: 5 },
        { skip: !restaurantId }
    );

    // Get restaurant stats
    const { data: statsData } = useGetRestaurantStatsQuery(
        restaurantId!,
        { skip: !restaurantId }
    );

    const stats = statsData?.data || {
        totalRevenue: 0,
        totalOrders: 0,
        todayRevenue: 0,
        todayOrders: 0,
        pendingOrders: 0
    };

    if (restaurantLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-white/60">Loading restaurant data...</p>
            </div>
        );
    }

    if (restaurantError || !restaurant) {
        return (
            <div className="text-center py-12">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <h2 className="text-2xl font-bold mb-2">No Restaurant Assigned</h2>
                <p className="text-white/60">
                    Please contact admin to assign a restaurant to your account.
                </p>
            </div>
        );
    }

    const orders = ordersData?.data?.orders || [];

    // Calculate popular items from orders
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const foodItem = item.foodItem as any;
            const key = foodItem._id || foodItem.name;
            if (!itemCounts[key]) {
                itemCounts[key] = { name: foodItem.name, count: 0, revenue: 0 };
            }
            itemCounts[key].count += item.quantity;
            itemCounts[key].revenue += item.price * item.quantity;
        });
    });

    const popularItems = Object.values(itemCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Restaurant Dashboard</h1>
                <p className="text-white/60">Manage your restaurant and track your performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-primary-500/10 rounded-xl">
                            <ShoppingCart className="w-6 h-6 text-primary-400" />
                        </div>
                        <span className="text-sm text-white/60">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stats.todayOrders}</h3>
                    <p className="text-sm text-white/60">Today's Orders</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <span className="text-sm text-white/60">Revenue</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">৳{stats.todayRevenue.toLocaleString()}</h3>
                    <p className="text-sm text-white/60">Today's Revenue</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <Clock className="w-6 h-6 text-yellow-400" />
                        </div>
                        <span className="text-sm text-white/60">Active</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stats.pendingOrders}</h3>
                    <p className="text-sm text-white/60">Pending Orders</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-sm text-white/60">Items</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{Object.keys(itemCounts).length}</h3>
                    <p className="text-sm text-white/60">Items Ordered</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Recent Orders
                        </h2>
                        <Link to="/restaurant-dashboard/orders" className="text-primary-400 hover:text-primary-300 text-sm">
                            View All →
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-8 text-white/60">
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No orders yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.slice(0, 3).map((order) => {
                                const customer = order.user as any;
                                return (
                                    <div key={order._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                        <div>
                                            <p className="font-medium">#{order.orderNumber}</p>
                                            <p className="text-sm text-white/60">{customer.name} • {order.items.length} items</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-400">৳{order.totalAmount}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.orderStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                order.orderStatus === 'preparing' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-green-500/10 text-green-400'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Popular Items */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ChefHat className="w-5 h-5" />
                            Popular Items
                        </h2>
                        <Link to="/restaurant-dashboard/menu" className="text-primary-400 hover:text-primary-300 text-sm">
                            Manage Menu →
                        </Link>
                    </div>

                    {popularItems.length === 0 ? (
                        <div className="text-center py-8 text-white/60">
                            <ChefHat className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No items ordered yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {popularItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-white/20">#{index + 1}</span>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-white/60">{item.count} orders</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-primary-400">৳{item.revenue.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link
                        to="/restaurant-dashboard/menu"
                        className="p-4 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl text-center transition-colors"
                    >
                        <ChefHat className="w-8 h-8 mx-auto mb-2 text-primary-400" />
                        <p className="font-medium">Add Menu Item</p>
                    </Link>
                    <Link
                        to="/restaurant-dashboard/orders?status=pending"
                        className="p-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl text-center transition-colors"
                    >
                        <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <p className="font-medium">Pending Orders</p>
                    </Link>
                    <Link
                        to="/restaurant-dashboard/menu"
                        className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center transition-colors"
                    >
                        <Package className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">View Menu</p>
                    </Link>
                    <Link
                        to="/restaurant-dashboard/orders"
                        className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center transition-colors"
                    >
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">All Orders</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboardPage;
